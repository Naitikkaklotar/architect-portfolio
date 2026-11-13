import manifest from "./image-manifest.json";

/**
 * srcSet of WebP sizes for a photo in /uploads (including project subfolders),
 * or undefined when none exist (external URLs, or photos not yet processed).
 *
 *   /uploads/vrindavan-bungalow/cover.jpg
 *     -> /uploads/_opt/vrindavan-bungalow/cover-960.webp 960w, …
 */
export function responsiveSrcSet(src) {
  const widths = manifest[src];
  if (!widths?.length) return undefined;
  const relative = src.replace(/^\/uploads\//, "").replace(/\.[^.]+$/, "");
  const parts = relative.split("/");
  const base = parts.pop();
  const dir = parts.map(encodeURIComponent).join("/");
  const prefix = dir ? `${dir}/` : "";
  return widths
    .map((w) => `/uploads/_opt/${prefix}${encodeURIComponent(base)}-${w}.webp ${w}w`)
    .join(", ");
}
