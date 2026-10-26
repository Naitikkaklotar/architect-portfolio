import manifest from "./image-manifest.json";

/**
 * srcSet of WebP sizes for a photo in /uploads, or undefined when none exist
 * (external URLs, or photos not yet processed).
 */
export function responsiveSrcSet(src) {
  const widths = manifest[src];
  if (!widths?.length) return undefined;
  const base = src.replace(/^\/uploads\//, "").replace(/\.[^.]+$/, "");
  return widths
    .map((w) => `/uploads/_opt/${encodeURIComponent(base)}-${w}.webp ${w}w`)
    .join(", ");
}
