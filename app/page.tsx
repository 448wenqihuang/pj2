import BeatList from "@/components/BeatList";

async function fetchBeats() {
  try {
    const res = await fetch("http://localhost:3000/api/beats", {
      cache: "no-store",
    });

    // 如果接口不是 2xx，先打印日志，前端就用空数组
    if (!res.ok) {
      console.error("Failed to fetch beats", res.status);
      return [];
    }

    // 有些情况下 body 可能是空的，这里做个保护
    const text = await res.text();
    if (!text) {
      return [];
    }

    return JSON.parse(text);
  } catch (err) {
    console.error("Error fetching beats", err);
    return [];
  }
}

export default async function HomePage() {
  const beats = await fetchBeats();

  return (
    <div className="space-y-8">
      <section className="hero-animated rounded-3xl border border-white/10 glass-panel px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300/80">
              Lunchbox • Shared Vault
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              A small universe where
              <br />
              producers drop their <span className="text-pink-300/90">beats</span>.
            </h1>
            <p className="text-sm text-slate-200/80 max-w-xl">
              Anyone with the link can upload a beat with their producer name.
              Everything is stored in a persistent database so the vault keeps
              growing over time.
            </p>
          </div>

          <div className="flex md:flex-col gap-4 text-xs sm:text-sm">
            <div className="glass-panel rounded-2xl px-4 py-3 w-full md:w-56">
              <p className="text-slate-300/80">Total beats</p>
              <p className="text-2xl font-semibold">
                {beats.length.toString().padStart(2, "0")}
              </p>
            </div>
            <a
              href="/upload"
              className="glass-panel rounded-2xl px-4 py-3 flex items-center justify-between hover:bg-white/[0.02] transition"
            >
              <div>
                <p className="text-slate-300/80 text-xs">Start contributing</p>
                <p className="text-sm font-medium">Upload your first beat</p>
              </div>
              <span className="text-lg">➜</span>
            </a>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm uppercase tracking-[0.2em] text-slate-300/80">
            The Vault
          </h2>
          <p className="text-xs text-slate-400">
            All beats are pulled directly from the database in real time.
          </p>
        </div>

        <BeatList beats={beats} />
      </section>
    </div>
  );
}
