"use client";

import { useEffect, useMemo, useState } from "react";

type Beat = {
  _id: string;
  title: string;
  producerName: string;
  bpm?: number;
  key?: string;
  moodTags?: string[];
  price?: number | null;
  audioUrl: string;
  createdAt?: string;
};

type FormState = {
  title: string;
  producerName: string;
  bpm: string;
  key: string;
  moodTags: string;
  price: string;
  audioUrl: string;
};

const emptyForm: FormState = {
  title: "",
  producerName: "",
  bpm: "",
  key: "",
  moodTags: "",
  price: "",
  audioUrl: "",
};

export default function VaultPage() {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchBeats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/beats", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to fetch beats");
      }
      const data = await res.json();
      setBeats(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load beats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeats();
  }, []);

  const startEdit = (beat: Beat) => {
    setEditingId(beat._id);
    setForm({
      title: beat.title || "",
      producerName: beat.producerName || "",
      bpm: beat.bpm?.toString() || "",
      key: beat.key || "",
      moodTags: beat.moodTags?.join(", ") || "",
      price:
        beat.price === null || beat.price === undefined
          ? ""
          : beat.price.toString(),
      audioUrl: beat.audioUrl || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/beats/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          producerName: form.producerName,
          bpm: form.bpm ? Number(form.bpm) : null,
          key: form.key,
          price: form.price === "" ? null : Number(form.price),
          moodTags: form.moodTags,
          audioUrl: form.audioUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Failed to update beat");
      }

      const updated = await res.json();
      setBeats((prev) =>
        prev.map((b) => (b._id === updated._id ? updated : b))
      );
      cancelEdit();
    } catch (err: any) {
      setError(err?.message || "Failed to update beat");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this beat?")) return;

    const targetId = id.trim();
    setDeletingId(targetId);
    setError(null);
    try {
      const res = await fetch(
        `/api/beats/${encodeURIComponent(targetId)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Failed to delete beat");
      }

      setBeats((prev) => prev.filter((b) => b._id !== targetId));
      if (editingId === targetId) cancelEdit();
      // 最后再刷新一次，确保与服务端一致
      fetchBeats();
    } catch (err: any) {
      setError(err?.message || "Failed to delete beat");
    } finally {
      setDeletingId(null);
    }
  };

  const moodString = (beat: Beat) =>
    beat.moodTags && beat.moodTags.length > 0
      ? beat.moodTags.join(", ")
      : "No tags";

  const latestBeatDate = useMemo(() => {
    if (!beats.length) return "";
    const latest = beats.reduce((acc, b) => {
      const d = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return d > acc ? d : acc;
    }, 0);
    return latest ? new Date(latest).toLocaleString() : "";
  }, [beats]);

  return (
    <main className="space-y-10">
      <section className="glass-panel hero-animated rounded-3xl p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-200/80 mb-3">
          Lunchbox Beat Vault
        </p>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-2">
              Vault overview
            </h1>
            <p className="text-slate-200/80 max-w-2xl text-sm md:text-base">
              Browse every beat in the vault, edit metadata, and prune drafts.
              Upload new beats from the Upload tab.
            </p>
          </div>
          <div className="text-sm text-slate-200/80">
            <div className="font-semibold text-lg">{beats.length} beats</div>
            {latestBeatDate && (
              <div className="text-xs text-slate-300/70">
                Latest: {latestBeatDate}
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-300/80">
          <button
            onClick={fetchBeats}
            className="px-3 py-1 rounded-full border border-indigo-300/60 text-white bg-indigo-500/60 hover:bg-indigo-500 transition"
          >
            Refresh
          </button>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-400/40 bg-red-500/15 text-red-100 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl glass-panel p-10 text-center text-slate-200/80">
          Loading beats...
        </div>
      ) : beats.length === 0 ? (
        <div className="rounded-2xl glass-panel p-10 text-center text-slate-200/80">
          No beats yet. Upload one to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {beats.map((beat) => {
            const isEditing = editingId === beat._id;
            return (
              <div
                key={beat._id}
                className="rounded-2xl glass-panel border border-white/10 p-5 md:p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-lg font-semibold">{beat.title}</div>
                    <div className="text-sm text-slate-300/80">
                      {beat.producerName} | {beat.bpm ?? "-"} BPM | {beat.key || "Key ?"}
                    </div>
                    <div className="text-xs text-slate-300/70">
                      Tags: {moodString(beat)}
                    </div>
                    <div className="text-xs text-slate-300/70">
                      {beat.price === null || beat.price === undefined
                        ? "Free"
                        : `$${beat.price}`}
                    </div>
                    <a
                      href={beat.audioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-indigo-200 hover:text-indigo-100"
                    >
                      Listen
                    </a>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <button
                      onClick={() => startEdit(beat)}
                      className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(beat._id)}
                      disabled={deletingId === beat._id}
                      className="px-3 py-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 disabled:opacity-60"
                    >
                      {deletingId === beat._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-5 border-t border-white/10 pt-4 space-y-4">
                    <div className="grid md:grid-cols-2 gap-3">
                      <label className="text-xs text-slate-300/80 space-y-1">
                        <span>Title</span>
                        <input
                          className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm"
                          value={form.title}
                          onChange={(e) =>
                            setForm({ ...form, title: e.target.value })
                          }
                        />
                      </label>
                      <label className="text-xs text-slate-300/80 space-y-1">
                        <span>Producer</span>
                        <input
                          className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm"
                          value={form.producerName}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              producerName: e.target.value,
                            })
                          }
                        />
                      </label>
                    </div>

                    <div className="grid md:grid-cols-3 gap-3">
                      <label className="text-xs text-slate-300/80 space-y-1">
                        <span>BPM</span>
                        <input
                          type="number"
                          className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm"
                          value={form.bpm}
                          onChange={(e) =>
                            setForm({ ...form, bpm: e.target.value })
                          }
                        />
                      </label>
                      <label className="text-xs text-slate-300/80 space-y-1">
                        <span>Key</span>
                        <input
                          className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm"
                          value={form.key}
                          onChange={(e) =>
                            setForm({ ...form, key: e.target.value })
                          }
                        />
                      </label>
                      <label className="text-xs text-slate-300/80 space-y-1">
                        <span>Price (blank = free)</span>
                        <input
                          type="number"
                          className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm"
                          value={form.price}
                          onChange={(e) =>
                            setForm({ ...form, price: e.target.value })
                          }
                        />
                      </label>
                    </div>

                    <label className="block text-xs text-slate-300/80 space-y-1">
                      <span>Mood tags (comma separated)</span>
                      <input
                        className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm"
                        value={form.moodTags}
                        onChange={(e) =>
                          setForm({ ...form, moodTags: e.target.value })
                        }
                      />
                    </label>

                    <label className="block text-xs text-slate-300/80 space-y-1">
                      <span>Audio URL</span>
                      <input
                        className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm"
                        value={form.audioUrl}
                        onChange={(e) =>
                          setForm({ ...form, audioUrl: e.target.value })
                        }
                      />
                    </label>

                    <div className="flex gap-3 text-xs">
                      <button
                        onClick={handleUpdate}
                        disabled={saving}
                        className="px-4 py-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-400 disabled:opacity-60"
                      >
                        {saving ? "Saving..." : "Save changes"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        type="button"
                        className="px-4 py-2 rounded-full bg-white/10 border border-white/15 hover:bg-white/15"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
