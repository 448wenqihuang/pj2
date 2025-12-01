import mongoose, { Schema, models, model } from "mongoose";

const BeatSchema = new Schema(
  {
    title: { type: String, required: true },
    producerName: { type: String, required: true },
    bpm: Number,
    key: String,
    moodTags: [String],
    price: Number,
    audioUrl: { type: String, required: true },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Beat || model("Beat", BeatSchema);
