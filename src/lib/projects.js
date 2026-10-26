import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const projectsDirectory = path.join(process.cwd(), "content/projects");

function ensureProjectsDir() {
  if (!fs.existsSync(projectsDirectory)) {
    return [];
  }
  return fs.readdirSync(projectsDirectory).filter((file) => file.endsWith(".md"));
}

function normalizeHotspots(hotspots) {
  if (!Array.isArray(hotspots)) return [];
  return hotspots
    .map((spot) => {
      if (!spot) return null;
      const label = spot.label || spot.title || "";
      const href = spot.href || spot.link || spot.url || "";
      const note = spot.note || spot.text || "";
      if (!label || (!href && !note)) return null;
      return {
        label: String(label),
        href: href ? String(href) : "",
        note: note ? String(note) : "",
        x: Number(spot.x) || 0,
        y: Number(spot.y) || 0,
      };
    })
    .filter(Boolean);
}

/**
 * Normalize gallery items to { src, caption, description, hotspots }.
 * Supports plain URL strings or { image/src, caption/label } objects.
 */
function normalizeImages(images) {
  if (!Array.isArray(images)) return [];

  return images
    .map((item) => {
      if (!item) return null;
      if (typeof item === "string") {
        return {
          src: item,
          caption: captionFromPath(item),
          description: "",
          hotspots: [],
          group: "",
        };
      }
      const src = item.image || item.src || "";
      if (!src) return null;
      return {
        src,
        caption: item.caption || item.label || captionFromPath(src),
        description: item.description || item.desc || "",
        hotspots: normalizeHotspots(item.hotspots),
        group: item.group ? String(item.group) : "",
      };
    })
    .filter(Boolean);
}

/** Optional floor plans: [{ image, title, description }] */
function normalizePlans(plans) {
  if (!Array.isArray(plans)) return [];
  return plans
    .map((item) => {
      if (!item) return null;
      const src = item.image || item.src || "";
      if (!src) return null;
      const rooms = (Array.isArray(item.rooms) ? item.rooms : [])
        .filter((r) => r && r.name)
        .map((r) => ({ name: String(r.name), size: r.size ? String(r.size) : "" }));
      return {
        src,
        title: item.title || item.caption || "Floor plan",
        description: item.description || "",
        rooms,
      };
    })
    .filter(Boolean);
}

/** Optional before/after comparison: { before, after, caption, beforeLabel, afterLabel } */
function normalizeCompare(compare) {
  if (!compare || typeof compare !== "object") return null;
  if (!compare.before || !compare.after) return null;
  return {
    before: String(compare.before),
    after: String(compare.after),
    title: compare.title ? String(compare.title) : "See the difference",
    caption: compare.caption ? String(compare.caption) : "",
    beforeLabel: compare.before_label ? String(compare.before_label) : "Before",
    afterLabel: compare.after_label ? String(compare.after_label) : "After",
  };
}

/** Simple list of { value, label } stats. */
function normalizeHighlights(list) {
  return (Array.isArray(list) ? list : [])
    .filter((h) => h && h.value && h.label)
    .map((h) => ({ value: String(h.value), label: String(h.label) }));
}

/** Design story / progress steps: { title, text, date, image }. */
function normalizeSteps(list) {
  return (Array.isArray(list) ? list : [])
    .filter((x) => x && x.title)
    .map((x) => ({
      title: String(x.title),
      text: x.text ? String(x.text) : "",
      date: x.date ? String(x.date) : "",
      image: x.image ? String(x.image) : "",
    }));
}

/** Optional climate report block (benefits, sustainable features, screen details). */
function normalizeClimate(climate) {
  if (!climate || typeof climate !== "object") return null;
  const benefits = (Array.isArray(climate.benefits) ? climate.benefits : [])
    .filter((b) => b && b.value && b.label)
    .map((b) => ({ value: String(b.value), label: String(b.label) }));
  const features = (Array.isArray(climate.features) ? climate.features : [])
    .filter((f) => f && f.title)
    .map((f) => ({ title: String(f.title), text: f.text ? String(f.text) : "" }));
  if (!benefits.length && !features.length) return null;
  const cut = Number(climate.screen_cut);
  return {
    intro: climate.intro ? String(climate.intro) : "",
    benefits,
    features,
    note: climate.note ? String(climate.note) : "",
    screenName: climate.screen_name ? String(climate.screen_name) : "Jaali screen",
    screenCut: Number.isFinite(cut) && cut > 0 && cut < 100 ? cut : 78,
  };
}

function captionFromPath(src) {
  const file = String(src).split("/").pop() || "";
  const base = file.replace(/\.[^.]+$/, "");
  // e.g. villa-kitchen → Kitchen, loft-meeting → Meeting
  const parts = base.split("-");
  const room = parts.length > 1 ? parts.slice(1).join(" ") : base;
  return room.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Short plain-text blurb for cards (from excerpt field or first body paragraph). */
function makeExcerpt(data, content = "") {
  if (data.excerpt) return String(data.excerpt).trim();

  const plain = String(content)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[[^\]]*\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~]/g, "")
    .replace(/\n+/g, " ")
    .trim();

  if (!plain) return "";
  if (plain.length <= 140) return plain;
  return `${plain.slice(0, 137).trim()}…`;
}

export function formatProjectNumber(index) {
  return String(index + 1).padStart(2, "0");
}

function mapProject(data, slug, content = "") {
  return {
    slug,
    title: data.title ?? slug,
    category: data.category ?? "Other",
    location: data.location ?? "",
    year: data.year ?? 0,
    area: data.area ?? null,
    role: data.role ?? null,
    status: data.status ?? null,
    featured: Boolean(data.featured),
    cover: data.cover ?? "",
    coverMobile: data.cover_mobile ?? "",
    coverZoom: data.cover_zoom === true,
    images: normalizeImages(data.images),
    galleryAspect: data.gallery_aspect ? String(data.gallery_aspect) : "",
    plans: normalizePlans(data.plans),
    compare: normalizeCompare(data.compare),
    highlights: normalizeHighlights(data.highlights),
    story: normalizeSteps(data.story),
    progress: normalizeSteps(data.progress),
    video: data.video ?? null,
    climate: normalizeClimate(data.climate),
    excerpt: makeExcerpt(data, content),
    number: null,
  };
}

function withProjectNumbers(projects) {
  return projects.map((project, index) => ({
    ...project,
    number: formatProjectNumber(index),
  }));
}

/**
 * Read all project Markdown files, parse front matter, return sorted by year desc.
 * Each project gets an editorial index: 01, 02, 03…
 */
export function getAllProjects() {
  const fileNames = ensureProjectsDir();

  const projects = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(projectsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    return mapProject(data, slug, content);
  });

  const sorted = projects.sort((a, b) => (b.year || 0) - (a.year || 0));
  return withProjectNumbers(sorted);
}

/**
 * Get a single project by slug, with Markdown body converted to HTML.
 */
export async function getProjectBySlug(slug) {
  const all = getAllProjects();
  const listed = all.find((p) => p.slug === slug);
  if (!listed) return null;

  const fullPath = path.join(projectsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();

  return {
    ...mapProject(data, slug, content),
    number: listed.number,
    contentHtml,
  };
}

export function getFeaturedProjects() {
  return getAllProjects().filter((project) => project.featured);
}

export function getProjectSlugs() {
  return ensureProjectsDir().map((fileName) => fileName.replace(/\.md$/, ""));
}

/** Previous / next project in the year-desc list (wraps). */
export function getAdjacentProjects(slug) {
  const projects = getAllProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };

  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return {
    prev: prev.slug === slug ? null : prev,
    next: next.slug === slug ? null : next,
  };
}
