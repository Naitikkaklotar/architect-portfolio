import { Cormorant_Garamond, Poppins } from "next/font/google";
import SiteShell from "@/components/SiteShell";
import { site } from "@/lib/site";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const body = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — ${site.architect}`,
    description: site.description,
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.architect}`,
    description: site.description,
    images: ["/og.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${site.url}/#business`,
  name: site.name,
  description: site.description,
  url: site.url,
  image: `${site.url}/og.jpg`,
  telephone: site.phoneTel,
  email: site.email,
  founder: {
    "@type": "Person",
    name: site.architect,
    jobTitle: "Architect",
    identifier: site.coa,
    knowsLanguage: site.languages,
  },
  areaServed: ["Surat", "Ahmedabad", "Mumbai"].map((name) => ({ "@type": "City", name })),
  address: { "@type": "PostalAddress", addressRegion: "Gujarat", addressCountry: "IN" },
  sameAs: [site.social.instagram, site.social.linkedin].filter(Boolean),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
