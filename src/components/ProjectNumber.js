/**
 * Editorial project index — e.g. 01, 02
 */
export default function ProjectNumber({
  number,
  className = "",
  tone = "dark",
}) {
  if (!number) return null;

  const toneClass =
    tone === "light"
      ? "text-white/55"
      : tone === "muted"
        ? "text-[#b0a99c]"
        : "text-[#c4b8a5]";

  return (
    <span
      className={`font-display tabular-nums tracking-[0.08em] ${toneClass} ${className}`}
      aria-label={`Project ${number}`}
    >
      {number}
    </span>
  );
}
