import Link from "next/link";
import { site, whatsappUrl } from "@/lib/site";
import { navLinks } from "./navLinks";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-[#f0eee9]">
      <div className="site-container grid grid-cols-1 gap-10 py-12 md:grid-cols-2 md:py-16 lg:grid-cols-4 lg:gap-8">
        <div className="min-w-0 md:col-span-2 lg:col-span-2">
          <p className="font-display text-2xl tracking-[0.06em] break-words text-black">
            {site.name}
          </p>
          <p className="mt-1 text-sm text-[#3f3f3f]">{site.architect}</p>
          <p className="mt-3 max-w-prose text-sm leading-relaxed break-words text-[#5c5c5c]">
            {site.tagline}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.16em] text-[#6b6b6b]">Explore</p>
          <ul className="mt-4 space-y-1 text-sm text-[#3f3f3f]">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center [@media(hover:hover)]:hover:text-black"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.16em] text-[#6b6b6b]">Connect</p>
          <ul className="mt-4 space-y-1 text-sm text-[#3f3f3f]">
            <li>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex min-h-11 items-center break-all [@media(hover:hover)]:hover:text-black"
              >
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${site.phoneTel}`}
                className="inline-flex min-h-11 items-center [@media(hover:hover)]:hover:text-black"
              >
                {site.phone}
              </a>
            </li>
            {site.social.instagram ? (
              <li>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center [@media(hover:hover)]:hover:text-black"
                >
                  Instagram{site.social.instagramLabel ? ` · ${site.social.instagramLabel}` : ""}
                </a>
              </li>
            ) : null}
            {site.social.linkedin ? (
              <li>
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center [@media(hover:hover)]:hover:text-black"
                >
                  LinkedIn
                </a>
              </li>
            ) : null}
            <li>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center [@media(hover:hover)]:hover:text-black"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="site-container flex flex-col gap-2 border-t border-black/10 py-5 text-xs text-[#6b6b6b] md:flex-row md:items-center md:justify-between">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <a
          href="/admin/index.html"
          className="inline-flex min-h-11 items-center [@media(hover:hover)]:hover:text-black"
        >
          Admin
        </a>
      </div>
    </footer>
  );
}
