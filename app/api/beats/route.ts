// app/api/beats/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Beat from "@/models/Beat";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    await connectDB();
    const beats = await Beat.find().sort({ createdAt: -1 });
    return NextResponse.json(beats, { status: 200 });
  } catch (err) {
    console.error("GET /api/beats error", err);
    // 即使数据库连不上，也不要让前端 500，先返回空数组
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();

    const file = formData.get("audioFile") as File | null;
    if (!file) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    // 保存文件到 /public/uploads
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);
    await writeFile(filePath, buffer);

    const audioUrl = `/uploads/${fileName}`;
    const moodRaw = (formData.get("moodTags") as string) || "";

    const beat = await Beat.create({
      title: formData.get("title") as string,
      producerName: formData.get("producerName") as string,
      bpm: Number(formData.get("bpm")) || undefined,
      key: (formData.get("key") as string) || undefined,
      moodTags: moodRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      price: Number(formData.get("price")) || undefined,
      audioUrl,
    });

    return NextResponse.json(beat, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/beats error", err);

    const message =
      err instanceof Error
        ? err.message
        : typeof err === "string"
        ? err
        : "Failed to upload beat";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}