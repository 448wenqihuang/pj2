// app/upload/page.tsx
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

export default function UploadPage() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

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

      let data: any = null;
      const raw = await res.text();
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        data = { message: raw };
      }
      if (!res.ok) {
        throw new Error(data?.message || raw || "Upload failed");
      }

      setMsg("Upload OK!");
      setForm(emptyForm);
    } catch (err: any) {
      console.error("Upload error:", err);
      setMsg(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-white px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="glass-panel hero-animated rounded-3xl p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-200/80 mb-3">
            Upload a beat
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold mb-2">
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
              <p className="text-[11px] text-slate-400">Separate tags with commas.</p>
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
                disabled={loading}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white/90 text-slate-900 text-xs font-semibold tracking-wide hover:bg-white transition disabled:opacity-60"
              >
                {loading ? "Uploading..." : "Upload Beat"}
              </button>
              {msg && <p className="text-xs text-slate-200 whitespace-pre-line">{msg}</p>}
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
