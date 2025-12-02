import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB as connectToDatabase } from "@/lib/db";
import Beat from "@/models/Beat";

const serializeBeat = (beat: any) => {
  if (!beat) return beat;
  const obj = beat.toObject ? beat.toObject() : { ...beat };
  if (obj._id?.toString) obj._id = obj._id.toString();
  if (obj.createdAt?.toISOString) obj.createdAt = obj.createdAt.toISOString();
  if (obj.updatedAt?.toISOString) obj.updatedAt = obj.updatedAt.toISOString();
  return obj;
};

const resolveDocById = async (id: string) => {
  // Try string match first
  let doc = await Beat.findOne({ _id: id });
  if (doc) return doc;

  // Then try ObjectId match if valid and different
  if (mongoose.Types.ObjectId.isValid(id)) {
    const objectId = new mongoose.Types.ObjectId(id);
    doc = await Beat.findOne({ _id: objectId });
  }

  return doc;
};

const parseMoodTags = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((tag) => `${tag}`.trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
};

const sanitizeUpdates = (body: any) => {
  const updates: Record<string, any> = {};
  if ("title" in body) updates.title = body.title;
  if ("producerName" in body) updates.producerName = body.producerName;
  if ("bpm" in body) {
    const value = body.bpm;
    updates.bpm =
      value === null || value === undefined || value === ""
        ? undefined
        : Number(value);
  }
  if ("key" in body) updates.key = body.key;
  if ("price" in body) {
    const value = body.price;
    updates.price =
      value === null || value === undefined || value === ""
        ? null
        : Number(value);
  }
  if ("moodTags" in body) updates.moodTags = parseMoodTags(body.moodTags);
  if ("audioUrl" in body) updates.audioUrl = body.audioUrl;
  return updates;
};

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("GET /api/beats/:id", params.id);
    await connectToDatabase();
    const beat = await resolveDocById(params.id);
    if (!beat) {
      return NextResponse.json({ message: "Beat not found" }, { status: 404 });
    }
    return NextResponse.json(serializeBeat(beat), { status: 200 });
  } catch (err) {
    console.error("Error fetching beat:", err);
    return NextResponse.json(
      { message: "Failed to fetch beat" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("PATCH /api/beats/:id", params.id);
    const body = await req.json();
    const updates = sanitizeUpdates(body);

    await connectToDatabase();
    const beat = await resolveDocById(params.id);
    if (!beat) {
      return NextResponse.json({ message: "Beat not found" }, { status: 404 });
    }

    Object.assign(beat, updates);
    await beat.save();

    if (!beat) {
      return NextResponse.json({ message: "Beat not found" }, { status: 404 });
    }

    return NextResponse.json(serializeBeat(beat), { status: 200 });
  } catch (err) {
    console.error("Error updating beat:", err);
    return NextResponse.json(
      { message: "Failed to update beat" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("DELETE /api/beats/:id", params.id);
    await connectToDatabase();
    const beat = await resolveDocById(params.id);
    if (!beat) {
      return NextResponse.json({ message: "Beat not found" }, { status: 404 });
    }
    await beat.deleteOne();
    const serialized = serializeBeat(beat);
    return NextResponse.json({ success: true, id: serialized._id }, { status: 200 });
  } catch (err: any) {
    console.error("Error deleting beat:", { id: params.id, err });
    const message =
      err?.name === "CastError" ? "Invalid id" : "Failed to delete beat";
    const status = err?.name === "CastError" ? 400 : 500;
    return NextResponse.json({ message }, { status });
  }
}
