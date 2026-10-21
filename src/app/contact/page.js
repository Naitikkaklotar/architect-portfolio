import Reveal from "@/components/Reveal";
import { site, whatsappUrl } from "@/lib/site";

export const metadata = {
  title: "Contact",
  description: `Contact ${site.name} for project inquiries.`,
};

export default function ContactPage() {
  return (
    <div className="site-container site-section scroll-mt-24">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 xl:gap-20">
        <div className="min-w-0">
          <Reveal>
            <h1 className="font-display text-4xl break-words text-black md:text-6xl xl:text-7xl">
              Contact
            </h1>
            <p className="mt-4 max-w-prose text-base text-[#6b6b6b] md:text-lg">
              Reach Keyur Kaklotar at KK Architect for commissions, collaborations, or a quick
              site discussion.
            </p>
          </Reveal>

          <Reveal delay={60}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-10">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp"
              >
                Chat on WhatsApp
              </a>
              <a href={`mailto:${site.email}`} className="btn-primary">
                Email KK Architect
              </a>
              <a href={`tel:${site.phoneTel}`} className="btn-ghost">
                Call {site.phone}
              </a>
            </div>
          </Reveal>

          <dl className="mt-12 space-y-8 md:mt-14">
            <Reveal delay={80}>
              <ContactRow label="Email">
                <a
                  href={`mailto:${site.email}`}
                  className="break-all [@media(hover:hover)]:hover:underline"
                >
                  {site.email}
                </a>
              </ContactRow>
            </Reveal>
            <Reveal delay={100}>
              <ContactRow label="Phone">
                <a
                  href={`tel:${site.phoneTel}`}
                  className="[@media(hover:hover)]:hover:underline"
                >
                  {site.phone}
                </a>
              </ContactRow>
            </Reveal>
            <Reveal delay={120}>
              <ContactRow label="Office">
                <p className="break-words">{site.address}</p>
                <p className="mt-1 text-[#6b6b6b]">{site.location}</p>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex min-h-11 items-center text-sm underline underline-offset-4"
                >
                  Open in Google Maps
                </a>
              </ContactRow>
            </Reveal>
            <Reveal delay={140}>
              <ContactRow label="Social">
                <div className="flex flex-col">
                  <a
                    href={site.social.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center [@media(hover:hover)]:hover:underline"
                  >
                    Instagram
                  </a>
                  <a
                    href={site.social.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center [@media(hover:hover)]:hover:underline"
                  >
                    LinkedIn
                  </a>
                </div>
              </ContactRow>
            </Reveal>
          </dl>
        </div>

        <Reveal delay={100}>
          <div className="border border-black/10 bg-[#f0eee9] p-6 sm:p-8 md:p-10">
            <h2 className="font-display text-2xl break-words text-black md:text-3xl">
              Prefer a form?
            </h2>
            <p className="mt-4 max-w-prose text-sm leading-relaxed break-words text-[#5c5c5c] md:text-base">
              This site stays fully static — no backend form. Use WhatsApp or email for the
              fastest reply. If you later want a form, connect a free service like Formspree.
            </p>
            <a
              href={whatsappUrl("Hello, I would like to start a project discussion.")}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp mt-8"
            >
              Message on WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function ContactRow({ label, children }) {
  return (
    <div className="border-t border-black/10 pt-5">
      <dt className="text-xs uppercase tracking-[0.16em] text-[#6b6b6b]">{label}</dt>
      <dd className="mt-3 text-base break-words text-black md:text-lg">{children}</dd>
    </div>
  );
}
