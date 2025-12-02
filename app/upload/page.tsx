// app/upload/page.tsx
"use client";

import { useState } from "react";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [producerName, setProducerName] = useState("");
  const [bpm, setBpm] = useState("");
  const [key, setKey] = useState("");
  const [price, setPrice] = useState("");
  const [moodTags, setMoodTags] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/beats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          producerName,
          bpm: Number(bpm),
          key,
          price: price ? Number(price) : null,
          moodTags,
          audioUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setMsg("✅ Upload OK!");
      // 清空表单
      setTitle("");
      setProducerName("");
      setBpm("");
      setKey("");
      setPrice("");
      setMoodTags("");
      setAudioUrl("");
    } catch (err: any) {
      console.error("Upload error:", err);
      setMsg(`❌ ${err.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen text-white">
      <form onSubmit={handleSubmit}>
        {/* 这里用你自己的 UI，只要绑定到这些 state 上就行 */}
        {/* 例如： */}
        {/* <input value={title} onChange={e => setTitle(e.target.value)} /> */}
      </form>
      {msg && <p>{msg}</p>}
    </main>
  );
}
