/**
 * Site-wide content. Everything here is edited from the admin panel
 * (Site settings, About page, Services page) and stored as JSON in /content.
 * JSON is imported at build time, so this works in server and client components.
 */
import aboutData from "../../content/pages/about.json";
import servicesData from "../../content/pages/services.json";
import siteData from "../../content/settings/site.json";

const list = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);
const text = (value, fallback = "") => (value == null ? fallback : String(value).trim());

const phone = text(siteData.phone);
const whatsapp = text(siteData.whatsapp).replace(/\D/g, "");

export const site = {
  name: text(siteData.name, "KK Architect"),
  architect: text(siteData.architect),
  tagline: text(siteData.tagline),
  description: text(siteData.description),
  intro: text(siteData.intro),
  email: text(siteData.email),
  phone,
  // Digits only, with a leading + — what a phone's "call" link needs.
  phoneTel: phone.replace(/[^\d+]/g, ""),
  whatsapp: whatsapp || phone.replace(/\D/g, ""),
  location: text(siteData.location),
  address: text(siteData.address),
  mapsUrl: text(siteData.mapsUrl),
  cvUrl: text(siteData.cv, "/cv.pdf"),
  coa: text(siteData.coa),
  languages: list(siteData.languages),
  social: {
    instagram: text(siteData.instagram),
    instagramLabel: text(siteData.instagramLabel),
    linkedin: text(siteData.linkedin),
  },
  url: "https://architect-portfolio.kkarchitect.workers.dev",
  services: list(servicesData.highlights),
  serviceOfferings: list(servicesData.offerings),
  process: list(servicesData.process).map((step, i) => ({
    step: String(i + 1).padStart(2, "0"),
    title: step.title,
    text: step.text,
  })),
  stats: list(siteData.stats),
  about: {
    role: text(aboutData.role),
    bio: list(aboutData.bio),
    philosophy: text(aboutData.philosophy),
    experience: list(aboutData.experience),
    expertise: list(aboutData.expertise),
    earlierProjects: list(aboutData.earlierProjects),
    software: list(aboutData.software),
    achievements: list(aboutData.achievements),
  },
};

export function whatsappUrl(message = "Hello, I would like to discuss a project with KK Architect.") {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

/**
 * WhatsApp inquire link for a product.
 * WhatsApp cannot auto-attach images via URL — we include the photo link
 * and product page so you can open them from the chat.
 */
export function productWhatsappUrl(product) {
  const pageUrl = `${site.url}/products/${product.slug}`;
  const imageUrl = product.cover
    ? product.cover.startsWith("http")
      ? product.cover
      : `${site.url}${product.cover.startsWith("/") ? "" : "/"}${product.cover}`
    : "";

  const lines = [
    `Hello, I would like to inquire about: ${product.title}`,
    product.summary ? `Note: ${product.summary}` : null,
    `Product page: ${pageUrl}`,
    imageUrl ? `Photo: ${imageUrl}` : null,
  ].filter(Boolean);

  return whatsappUrl(lines.join("\n"));
}
