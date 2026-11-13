/**
 * Builds responsive WebP copies of every photo under public/uploads
 * (including per-project folders like public/uploads/vrindavan-bungalow/).
 *
 *   public/uploads/vrindavan-bungalow/cover.jpg
 *     -> public/uploads/_opt/vrindavan-bungalow/cover-480.webp / -960.webp / …
 *
 * Shared root photos (architect.jpg, hero.jpg) still go to public/uploads/_opt/.
 * Writes src/lib/image-manifest.json so the site knows which widths exist.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const uploads = path.join(root, "public/uploads");
const outDir = path.join(uploads, "_opt");
const manifestPath = path.join(root, "src/lib/image-manifest.json");

const WIDTHS = [480, 960, 1600, 2400];
const QUALITY = 86;
const IMAGE_RE = /\.(jpe?g|png)$/i;

const manifest = {};

/** Recursively list image files under uploads, skipping _opt. */
function listImages(dir, rel = "") {
  if (!fs.existsSync(dir)) return [];
  const found = [];
  for (const name of fs.readdirSync(dir)) {
    if (name === "_opt" || name.startsWith(".")) continue;
    const full = path.join(dir, name);
    const nextRel = rel ? `${rel}/${name}` : name;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      found.push(...listImages(full, nextRel));
    } else if (stat.isFile() && IMAGE_RE.test(name)) {
      found.push({ full, rel: nextRel });
    }
  }
  return found;
}

if (fs.existsSync(uploads)) {
  fs.mkdirSync(outDir, { recursive: true });
  const files = listImages(uploads).sort((a, b) => a.rel.localeCompare(b.rel));

  let made = 0;
  for (const { full: input, rel } of files) {
    const baseRel = rel.replace(/\.[^.]+$/, "");
    const optSubdir = path.join(outDir, path.dirname(baseRel));
    const baseName = path.basename(baseRel);
    try {
      const meta = await sharp(input).metadata();
      const original = meta.width || 0;
      if (!original) continue;

      const maxW = Math.max(...WIDTHS);
      const widths = [
        ...new Set([...WIDTHS.filter((w) => w < original), Math.min(original, maxW)]),
      ].sort((a, b) => a - b);

      fs.mkdirSync(optSubdir, { recursive: true });

      for (const w of widths) {
        const target = path.join(optSubdir, `${baseName}-${w}.webp`);
        const fresh =
          fs.existsSync(target) && fs.statSync(target).mtimeMs >= fs.statSync(input).mtimeMs;
        if (!fresh) {
          await sharp(input)
            .rotate()
            .resize({ width: w, withoutEnlargement: true })
            .webp({ quality: QUALITY })
            .toFile(target);
          made += 1;
        }
      }
      manifest[`/uploads/${rel.replace(/\\/g, "/")}`] = widths;
    } catch (err) {
      console.warn(`[optimize-images] skipped ${rel}: ${err.message}`);
    }
  }
  console.log(`[optimize-images] ${files.length} photos, ${made} new WebP files`);
}

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
