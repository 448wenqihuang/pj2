import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Beat } from "@/models/Beat";

export const dynamic = "force-dynamic";

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

// GET /api/beats — list beats
export async function GET() {
  try {
    await connectToDatabase();
    const beats = await Beat.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(beats, { status: 200 });
  } catch (err) {
    console.error("Error fetching beats:", err);
    return NextResponse.json({ message: "Failed to fetch beats" }, { status: 500 });
  }
}

// POST /api/beats — create beat (JSON)
export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { title, producerName, bpm, key, price, moodTags, audioUrl } = body;

    const normalizedBpm =
      typeof bpm === "number" ? bpm : bpm === "" || bpm === null || bpm === undefined ? null : Number(bpm);

    if (!title || !producerName || normalizedBpm === null || !key || !audioUrl) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const beat = await Beat.create({
      title,
      producerName,
      bpm: normalizedBpm,
      key,
      price: price === "" || price === undefined ? null : Number(price),
      moodTags: parseMoodTags(moodTags),
      audioUrl,
    });

    return NextResponse.json(beat, { status: 201 });
  } catch (err: any) {
    console.error("Error in /api/beats POST:", err);
    const message =
      err?.message?.includes("MONGODB_URI")
        ? "Database connection is not configured"
        : err?.message || "Failed to create beat";
    return NextResponse.json({ message }, { status: 500 });
  }
}
