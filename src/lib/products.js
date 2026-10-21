import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const productsDirectory = path.join(process.cwd(), "content/products");

function ensureDir() {
  if (!fs.existsSync(productsDirectory)) return [];
  return fs.readdirSync(productsDirectory).filter((f) => f.endsWith(".md"));
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
  return ensureDir()
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(productsDirectory, file), "utf8");
      const { data } = matter(raw);
      return mapProduct(data, slug);
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getProductSlugs() {
  return getAllProducts().map((p) => p.slug);
}

export async function getProductBySlug(slug) {
  const fullPath = path.join(productsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const processed = await remark().use(html).process(content);

  return {
    ...mapProduct(data, slug),
    contentHtml: processed.toString(),
  };
}
