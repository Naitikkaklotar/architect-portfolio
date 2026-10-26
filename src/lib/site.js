export const site = {
  name: "KK Architect",
  architect: "Keyur Kaklotar",
  tagline: "Residential architecture, interiors, and turnkey execution.",
  description:
    "KK Architect — Keyur Kaklotar, Council of Architecture registered architect (CA/2019/115819). Villas, homes, interiors, and turnkey projects across Surat, Ahmedabad, and Mumbai.",
  intro:
    "Founded in 2020, KK Architect is led by Keyur Kaklotar — 8+ years in residential architecture, interiors, and turnkey delivery, with 125+ projects and 50+ turnkey handovers.",
  email: "kkarchitect15151@gmail.com",
  phone: "+91 95868 53858",
  phoneTel: "+919586853858",
  whatsapp: "919586853858",
  location: "Surat · Ahmedabad · Mumbai",
  address: "Projects across Surat, Ahmedabad, and Mumbai",
  mapsUrl: "https://maps.google.com/?q=Adajan+Surat",
  cvUrl: "/cv.pdf",
  coa: "CA/2019/115819",
  languages: ["Gujarati", "Hindi", "English"],
  social: {
    instagram: "https://instagram.com/kkarchitects",
    instagramLabel: "kkarchitect's",
    linkedin: "",
  },
  url: "https://architect-portfolio.kkarchitect.workers.dev",
  services: [
    {
      title: "Villas & homes",
      text: "Luxury villas, weekend homes, and farmhouses — from concept through handover.",
    },
    {
      title: "Interiors",
      text: "Residential interiors with clear drawings, materials, and site coordination.",
    },
    {
      title: "Turnkey",
      text: "Design, approvals, budgeting, execution, and final handover on one team.",
    },
  ],
  serviceOfferings: [
    {
      title: "Architectural design",
      text: "Concept, planning, design development, and working drawings for homes, villas, and larger programs.",
    },
    {
      title: "Interior design",
      text: "Residential interiors — layouts, 3D views, material palettes, and execution details.",
    },
    {
      title: "Turnkey delivery",
      text: "Full project lifecycle: design, working drawings, approvals, budgeting, execution, and handover. 50+ turnkey projects delivered.",
    },
    {
      title: "Hospitality & commercial",
      text: "Clubs, resorts, commercial spaces, and hospital projects, alongside residential work.",
    },
    {
      title: "Renovation",
      text: "Alterations and renovations coordinated with consultants, vendors, and the site team.",
    },
    {
      title: "Sustainable design",
      text: "Practical climate response — shading, daylight, landscape cooling, and lower energy use, as in the Vrindavan bungalow.",
    },
  ],
  process: [
    { step: "01", title: "Brief", text: "Site, program, budget, and how the project should live day to day." },
    { step: "02", title: "Design", text: "Concept, planning, 3D views, and working drawings." },
    { step: "03", title: "Approvals", text: "Coordination with consultants and the paperwork needed to build." },
    { step: "04", title: "Execution", text: "Site coordination, vendors, quality checks, and handover." },
  ],
  stats: [
    { value: "125+", label: "Projects completed" },
    { value: "50+", label: "Turnkey projects" },
    { value: "8+", label: "Years of experience" },
    { value: "3", label: "Cities served" },
    { value: "100+", label: "Clients" },
  ],
  about: {
    role: "Architect | Founder — KK Architect",
    bio: [
      "Keyur Kaklotar is a Council of Architecture registered architect (CA/2019/115819) and founder of KK Architect. He has 8+ years in residential architecture, interior design, and turnkey project execution.",
      "His work covers design development, working drawings, client meetings, site coordination, and handover — with a focus on practical, well-built projects. Since 2020 the studio has completed 125+ projects, including more than 50 turnkey handovers, across Surat, Ahmedabad, and Mumbai.",
    ],
    philosophy:
      "Design that can be built. Innovative where it helps, practical where it must be — with quality drawings, clear coordination, and a finish the client can live with.",
    experience: [
      "2020 – present — Founder & Principal Architect, KK Architect. Villas, weekend homes, farmhouses, residential interiors, and hospital projects. Leads consultants, contractors, and site teams from concept to handover.",
      "May 2019 – Apr 2020 — Architect, Karmastu Architect, Surat. Residential, commercial, and hospitality work: working drawings, 3D views, vendors, and site management.",
      "2016 – 2018 — Junior Architect, Ishwar Gehi Architect, Surat (internship & job). Resorts, villa societies, and community projects — concept, planning, drawings, 3D, and site visits.",
    ],
    expertise: [
      "Luxury villas, weekend homes, and farmhouses",
      "Residential interiors",
      "Hospital and commercial projects",
      "Renovation, site coordination, and consultant management",
    ],
    earlierProjects: [
      "Arya Club & Resort — Rajkot",
      "Arya Family Club — Surat",
      "IGA Studio",
      "Agora City — Vadodara",
      "Vida 360 — Surat",
    ],
    software: [
      "AutoCAD — 95%",
      "SketchUp — 90%",
      "Photoshop — 85%",
      "MS Office — 80%",
    ],
    achievements: [
      "125+ projects across varied building types",
      "50+ turnkey projects delivered",
      "Council of Architecture registration CA/2019/115819",
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
