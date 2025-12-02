// app/api/beats/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Beat } from "@/models/Beat";

export const dynamic = "force-dynamic"; // 避免静态报错

// GET /api/beats  —— 读取所有 beat
export async function GET() {
  try {
    await connectToDatabase();
    const beats = await Beat.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(beats);
  } catch (err) {
    console.error("Error fetching beats:", err);
    return NextResponse.json(
      { message: "Failed to fetch beats" },
      { status: 500 }
    );
  }
}

// POST /api/beats  —— 新建 beat（接收 JSON）
export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { title, producerName, bpm, key, price, moodTags, audioUrl } = body;

    if (!title || !producerName || !bpm || !key || !audioUrl) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const beat = await Beat.create({
      title,
      producerName,
      bpm,
      key,
      price: price ?? null,
      moodTags: (moodTags || "")
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean),
      audioUrl,
    });

    return NextResponse.json(beat, { status: 201 });
  } catch (err) {
    console.error("Error in /api/beats POST:", err);
    return NextResponse.json(
      { message: "Failed to create beat" },
      { status: 500 }
    );
  }
}
