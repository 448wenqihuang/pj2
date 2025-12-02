import { NextResponse } from "next/server";
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

export async function GET() {
  try {
    await connectToDatabase();
    const beats = await Beat.find().sort({ createdAt: -1 });
    const serialized = beats.map(serializeBeat);
    return NextResponse.json(serialized, { status: 200 });
  } catch (err) {
    console.error("Error fetching beats:", err);
    return NextResponse.json(
      { message: "Failed to fetch beats" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { title, producerName, bpm, key, price, moodTags, audioUrl } = body;

    const created = await Beat.create({
      title,
      producerName,
      bpm: typeof bpm === "number" ? bpm : Number(bpm) || 0,
      key,
      price:
        price === null || price === undefined || price === ""
          ? null
          : Number(price),
      moodTags: parseMoodTags(moodTags),
      audioUrl,
    });

    return NextResponse.json(serializeBeat(created), { status: 201 });
  } catch (err) {
    console.error("Error creating beat:", err);
    return NextResponse.json(
      { message: "Failed to create beat" },
      { status: 500 }
    );
  }
}
