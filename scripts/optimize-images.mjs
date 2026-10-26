/**
 * Builds responsive WebP copies of every photo in public/uploads.
 *
 *   public/uploads/villa-cover.jpg
 *     -> public/uploads/_opt/villa-cover-480.webp / -960.webp / -1600.webp
 *
 * It also writes src/lib/image-manifest.json so the site knows which widths
 * exist for each photo. Runs automatically before `dev` and `build`, so photos
 * uploaded in the admin are optimised on the next deploy. Originals are never
 * changed.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const uploads = path.join(root, "public/uploads");
const outDir = path.join(uploads, "_opt");
const manifestPath = path.join(root, "src/lib/image-manifest.json");

const WIDTHS = [480, 960, 1600];
const QUALITY = 78;

const manifest = {};

if (fs.existsSync(uploads)) {
  fs.mkdirSync(outDir, { recursive: true });
  const files = fs
    .readdirSync(uploads)
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .sort();

  let made = 0;
  for (const file of files) {
    const input = path.join(uploads, file);
    const base = file.replace(/\.[^.]+$/, "");
    try {
      const meta = await sharp(input).metadata();
      const original = meta.width || 0;
      if (!original) continue;

      // widths smaller than the original, plus the original size (capped at 1600)
      const widths = [...new Set([...WIDTHS.filter((w) => w < original), Math.min(original, 1600)])]
        .sort((a, b) => a - b);

      for (const w of widths) {
        const target = path.join(outDir, `${base}-${w}.webp`);
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
      manifest[`/uploads/${file}`] = widths;
    } catch (err) {
      console.warn(`[optimize-images] skipped ${file}: ${err.message}`);
    }
  }
  console.log(`[optimize-images] ${files.length} photos, ${made} new WebP files`);
}

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
