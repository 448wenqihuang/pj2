import BeatCard from "./BeatCard";

export default function BeatList({ beats }: { beats: any[] }) {
  if (!beats.length) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-sm text-slate-200/80 border border-dashed border-white/20">
        No beats in the vault yet. Share the{" "}
        <span className="font-mono text-pink-200/90">/upload</span> link and be
        the first to drop something.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {beats.map((beat) => (
        <BeatCard key={beat._id} beat={beat} />
      ))}
    </div>
  );
}
