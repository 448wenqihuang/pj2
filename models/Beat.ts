// models/Beat.ts
import { Schema, model, models } from "mongoose";

const BeatSchema = new Schema(
  {
    title: { type: String, required: true },
    producerName: { type: String, required: true },
    bpm: { type: Number, required: true },
    key: { type: String, required: true },
    price: { type: Number },
    moodTags: [{ type: String }],
    audioUrl: { type: String, required: true }, // ⚠️ 用 URL，不存文件
  },
  { timestamps: true }
);

export const Beat = models.Beat || model("Beat", BeatSchema);
