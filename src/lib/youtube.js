/**
 * Convert common YouTube URL formats to an embed URL.
 * Supports: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID
 */
export function toYouTubeEmbedUrl(url) {
  if (!url || typeof url !== "string") return null;

  const trimmed = url.trim();
  let id = null;

  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (shortMatch) id = shortMatch[1];

  if (!id) {
    const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
    if (watchMatch) id = watchMatch[1];
  }

  if (!id) {
    const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/);
    if (embedMatch) id = embedMatch[1];
  }

  if (!id) return null;

  return `https://www.youtube.com/embed/${id}?rel=0`;
}
