export const site = {
  name: "KK Architect",
  architect: "Keyur Kaklotar",
  tagline: "Architecture shaped by light, material, and place.",
  description:
    "Architecture portfolio of Keyur Kaklotar — KK Architect. Residential, commercial, and interior projects.",
  intro:
    "KK Architect, led by Keyur Kaklotar, designs calm, climate-aware spaces for living and work — with careful light, honest materials, and rooms that age well.",
  email: "hello@kkarchitect.in",
  phone: "+91 87996 79326",
  phoneTel: "+918799679326",
  whatsapp: "918799679326",
  location: "Ahmedabad, India",
  address: "Near CG Road, Ahmedabad, Gujarat 380009",
  mapsUrl: "https://maps.google.com/?q=Ahmedabad+Gujarat",
  cvUrl: "/cv.pdf",
  social: {
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
  },
  url: "https://architect-portfolio.kkarchitect.workers.dev",
  services: [
    {
      title: "Residential",
      text: "Homes and villas planned around light, privacy, and daily ritual.",
    },
    {
      title: "Commercial",
      text: "Workplaces and retail with clear structure and lasting materials.",
    },
    {
      title: "Interior",
      text: "Quiet interiors — proportion, texture, and storage that disappears.",
    },
  ],
  serviceOfferings: [
    {
      title: "Architecture design",
      text: "From site study to construction drawings for new builds and additions.",
    },
    {
      title: "Interior design",
      text: "Spatial layouts, material palettes, and built-in furniture details.",
    },
    {
      title: "Planning",
      text: "Zoning logic, circulation, and program that fits how you actually live.",
    },
    {
      title: "3D visualization",
      text: "Clear visuals so decisions feel concrete before work begins on site.",
    },
  ],
  process: [
    { step: "01", title: "Consultation", text: "Brief, site, budget, and how the spaces should feel." },
    { step: "02", title: "Concept", text: "Massing, light studies, and first material ideas." },
    { step: "03", title: "Design", text: "Drawings, details, and coordination for buildability." },
    { step: "04", title: "Execution", text: "Site visits and refinements through completion." },
  ],
  about: {
    role: "Principal Architect, KK Architect",
    bio: [
      "Keyur Kaklotar is the principal architect behind KK Architect, a design practice based in Ahmedabad. The studio works across residential, commercial, and interior projects with a focus on climate, craft, and quiet spatial sequences.",
      "Each project begins with the site — orientation, breeze, and the way people move through a day. Drawings stay few; materials are chosen for how they age.",
    ],
    philosophy:
      "Build less, but build carefully. Prefer light over ornament, permanence over trend, and rooms that hold life without competing with it.",
    experience: [
      "Years of architectural practice under KK Architect",
      "Projects across Gujarat and western India",
      "Residential, commercial, and interior commissions",
    ],
    education: [
      "B.Arch — accredited architecture program",
      "Continuing study in sustainable building systems",
    ],
    awards: [
      "Regional design recognition for courtyard housing",
      "Featured studio work in local design forums",
    ],
    certifications: [
      "Council of Architecture registration",
      "Professional practice & ethics certification",
    ],
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
