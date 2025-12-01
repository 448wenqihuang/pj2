"use client";

import { useState } from "react";

export default function UploadBeatPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/beats", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("上传成功 ✅");
      e.currentTarget.reset();
    } else {
      setMessage(`上传失败：${data.error || "Unknown error"}`);
    }

    setIsSubmitting(false);
  }

  return (
    <div className="space-y-6">
      <section className="hero-animated rounded-3xl glass-panel border border-white/10 px-6 py-8 sm:px-10 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Upload a beat to the vault
        </h1>
        <p className="text-sm text-slate-200/80 max-w-xl">
          Anyone with this page can upload. Please enter your{" "}
          <span className="font-semibold">producer name</span> so listeners know
          who made the track.
        </p>
      </section>

      <section className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-xs uppercase tracking-[0.18em] text-slate-300/80">
                Beat Title
              </label>
              <input
                name="title"
                className="w-full border border-white/15 bg-black/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-pink-300/60"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-xs uppercase tracking-[0.18em] text-slate-300/80">
                Producer Name
              </label>
              <input
                name="producerName"
                placeholder="k / Lunchbox / your artist name"
                className="w-full border border-white/15 bg-black/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-pink-300/60"
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-xs uppercase tracking-[0.18em] text-slate-300/80">
                BPM
              </label>
              <input
                name="bpm"
                type="number"
                className="w-full border border-white/15 bg-black/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-pink-300/60"
              />
            </div>
            <div>
              <label className="block mb-1 text-xs uppercase tracking-[0.18em] text-slate-300/80">
                Key
              </label>
              <input
                name="key"
                placeholder="F# minor"
                className="w-full border border-white/15 bg-black/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-pink-300/60"
              />
            </div>
            <div>
              <label className="block mb-1 text-xs uppercase tracking-[0.18em] text-slate-300/80">
                Price (optional)
              </label>
              <input
                name="price"
                type="number"
                className="w-full border border-white/15 bg-black/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-pink-300/60"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-xs uppercase tracking-[0.18em] text-slate-300/80">
              Mood Tags
            </label>
            <input
              name="moodTags"
              placeholder="sad, drill, late night"
              className="w-full border border-white/15 bg-black/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-pink-300/60"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Separate tags with commas.
            </p>
          </div>

          <div>
            <label className="block mb-1 text-xs uppercase tracking-[0.18em] text-slate-300/80">
              Audio File
            </label>
            <input
              name="audioFile"
              type="file"
              accept="audio/*"
              className="w-full text-sm file:mr-3 file:px-3 file:py-1.5 file:rounded-full file:border-0 file:bg-white/10 file:text-slate-100 hover:file:bg-white/20"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white/90 text-slate-900 text-xs font-semibold tracking-wide hover:bg白 transition disabled:opacity-60"
          >
            {isSubmitting ? "Uploading..." : "Upload Beat"}
          </button>

          {message && (
            <p className="text-xs text-slate-200 mt-2">
              {message}
            </p>
          )}
        </form>
      </section>
    </div>
  );
}
