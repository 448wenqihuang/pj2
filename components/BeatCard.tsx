export default function BeatCard({ beat }: { beat: any }) {
  return (
    <article className="glass-panel rounded-2xl p-4 space-y-3 border border-white/10">
      <div>
        <h3 className="font-semibold text-base sm:text-lg leading-tight">
          {beat.title}
        </h3>
        <p className="text-xs text-slate-300/80 mt-1">
          by{" "}
          <span className="font-medium">
            {beat.producerName || "Unknown"}
          </span>
          {beat.bpm ? ` • ${beat.bpm} BPM` : ""}
          {beat.key ? ` • ${beat.key}` : ""}
        </p>
      </div>

      {beat.moodTags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {beat.moodTags.map((tag: string) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-1 rounded-full bg-white/5 text-slate-100/90"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <audio
        controls
        className="w-full mt-1 [&::-webkit-media-controls-panel]:bg-transparent [&::-webkit-media-controls-enclosure]:rounded-xl"
      >
        <source src={beat.audioUrl} />
        Your browser does not support the audio element.
      </audio>

      {beat.price && (
        <p className="text-xs text-slate-200/85">
          Price: <span className="font-medium">${beat.price}</span>
        </p>
      )}
    </article>
  );
}
