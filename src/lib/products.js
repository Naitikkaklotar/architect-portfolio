import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const productsDirectory = path.join(process.cwd(), "content/products");

/**
 * Products live as either:
 *   content/products/slug.md            (legacy)
 *   content/products/slug/index.md      (current — photos in /uploads/products/slug/)
 */
function listProductEntries() {
  if (!fs.existsSync(productsDirectory)) return [];
  const entries = [];
  for (const name of fs.readdirSync(productsDirectory)) {
    const full = path.join(productsDirectory, name);
    let stat;
    try {
      stat = fs.statSync(full);
    } catch {
      continue;
    }
    if (stat.isFile() && name.endsWith(".md")) {
      entries.push({ slug: name.replace(/\.md$/, ""), file: full });
      continue;
    }
    if (stat.isDirectory()) {
      const index = path.join(full, "index.md");
      if (fs.existsSync(index)) entries.push({ slug: name, file: index });
    }
  }
  return entries;
}

function productFilePath(slug) {
  const nested = path.join(productsDirectory, slug, "index.md");
  if (fs.existsSync(nested)) return nested;
  const flat = path.join(productsDirectory, `${slug}.md`);
  if (fs.existsSync(flat)) return flat;
  return null;
}

function mapProduct(data, slug) {
  return {
    slug,
    title: data.title ?? slug,
    brand: data.brand ?? "",
    category: data.category ?? "",
    price: data.price ?? "",
    cover: data.cover ?? "",
    summary: data.summary ?? "",
  };
}

export function getAllProducts() {
  return listProductEntries()
    .map(({ slug, file }) => {
      const raw = fs.readFileSync(file, "utf8");
      const { data } = matter(raw);
      return mapProduct(data, slug);
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getProductSlugs() {
  return getAllProducts().map((p) => p.slug);
}

export async function getProductBySlug(slug) {
  const fullPath = productFilePath(slug);
  if (!fullPath) return null;

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const processed = await remark().use(html).process(content);

  return {
    ...mapProduct(data, slug),
    contentHtml: processed.toString(),
  };
}
