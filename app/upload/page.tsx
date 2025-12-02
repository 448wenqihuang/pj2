"use client";

import { useState } from "react";

type FormState = {
  title: string;
  producerName: string;
  bpm: string;
  key: string;
  price: string;
  moodTags: string;
  audioUrl: string;
};

const emptyForm: FormState = {
  title: "",
  producerName: "",
  bpm: "",
  key: "",
  price: "",
  moodTags: "",
  audioUrl: "",
};

export default function UploadBeatPage() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/beats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          bpm: form.bpm ? Number(form.bpm) : 0,
          price: form.price === "" ? null : Number(form.price),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("上传成功 ✅");
        setForm(emptyForm);
      } else {
        setMessage(`上传失败：${data.message || "服务器错误"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("上传失败：网络错误");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="hero-animated rounded-3xl glass-panel border border-white/10 px-6 py-8 sm:px-10 sm:py-10">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-200/70 mb-3">
          Upload a beat
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold mb-2">
          Drop a new beat into the vault
        </h1>
        <p className="text-sm text-slate-200/80 max-w-2xl">
          Submit metadata with a public audio URL. Separate mood tags with commas; leave price blank for free.
        </p>
      </section>

      <section className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block text-xs uppercase tracking-[0.18em] text-slate-300/80 space-y-1">
              <span>Beat Title</span>
              <input
                className="w-full border border-white/15 bg-black/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-pink-300/60"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </label>

            <label className="block text-xs uppercase tracking-[0.18em] text-slate-300/80 space-y-1">
              <span>Producer Name</span>
              <input
                className="w-full border border-white/15 bg-black/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-pink-300/60"
                value={form.producerName}
                onChange={(e) =>
                  setForm({ ...form, producerName: e.target.value })
                }
                required
              />
            </label>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <label className="block text-xs uppercase tracking-[0.18em] text-slate-300/80 space-y-1">
              <span>BPM</span>
              <input
                type="number"
                className="w-full border border-white/15 bg-black/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-pink-300/60"
                value={form.bpm}
                onChange={(e) => setForm({ ...form, bpm: e.target.value })}
                required
              />
            </label>

            <label className="block text-xs uppercase tracking-[0.18em] text-slate-300/80 space-y-1">
              <span>Key</span>
              <input
                className="w-full border border-white/15 bg-black/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-pink-300/60"
                value={form.key}
                onChange={(e) => setForm({ ...form, key: e.target.value })}
                required
              />
            </label>

            <label className="block text-xs uppercase tracking-[0.18em] text-slate-300/80 space-y-1">
              <span>Price (optional)</span>
              <input
                type="number"
                className="w-full border border-white/15 bg-black/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-pink-300/60"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="Leave blank for free"
              />
            </label>
          </div>

          <label className="block text-xs uppercase tracking-[0.18em] text-slate-300/80 space-y-1">
            <span>Mood Tags</span>
            <input
              className="w-full border border-white/15 bg-black/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-pink-300/60"
              value={form.moodTags}
              onChange={(e) => setForm({ ...form, moodTags: e.target.value })}
              placeholder="sad, drill, late night"
            />
            <p className="text-[11px] text-slate-400">
              Separate tags with commas.
            </p>
          </label>

          <label className="block text-xs uppercase tracking-[0.18em] text-slate-300/80 space-y-1">
            <span>Audio URL (mp3)</span>
            <input
              className="w-full border border-white/15 bg-black/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-pink-300/60"
              value={form.audioUrl}
              onChange={(e) => setForm({ ...form, audioUrl: e.target.value })}
              placeholder="https://.../your-beat.mp3"
              required
            />
          </label>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white/90 text-slate-900 text-xs font-semibold tracking-wide hover:bg-white transition disabled:opacity-60"
            >
              {isSubmitting ? "Uploading..." : "Upload Beat"}
            </button>
            {message && (
              <p className="text-xs text-slate-200 whitespace-pre-line">
                {message}
              </p>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
