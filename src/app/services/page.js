import Link from "next/link";
import Reveal from "@/components/Reveal";
import { site, whatsappUrl } from "@/lib/site";

export const metadata = {
  title: "Services",
  description: `Architecture, interiors, planning, and visualization by ${site.name}.`,
};

export default function ServicesPage() {
  return (
    <div className="site-container site-section scroll-mt-24">
      <Reveal>
        <header className="mb-10 max-w-2xl md:mb-16 lg:mb-20">
          <h1 className="font-display text-4xl break-words text-black md:text-6xl xl:text-7xl">
            Services
          </h1>
          <p className="mt-4 max-w-prose text-base text-[#6b6b6b] md:text-lg">
            Clear scope. Thoughtful process. Spaces that feel inevitable once finished.
          </p>
        </header>
      </Reveal>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
        {site.serviceOfferings.map((item, i) => (
          <Reveal key={item.title} delay={i * 70}>
            <div className="min-w-0 border-t border-black/15 pt-6">
              <p className="text-xs tracking-[0.16em] text-[#6b6b6b]">0{i + 1}</p>
              <h2 className="mt-3 font-display text-2xl break-words text-black md:text-3xl xl:text-4xl">
                {item.title}
              </h2>
              <p className="mt-4 max-w-prose text-sm leading-relaxed text-[#5c5c5c] md:text-base">
                {item.text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <section className="mt-16 border-t border-black/10 pt-12 md:mt-24 md:pt-16 lg:mt-28 lg:pt-20">
        <Reveal>
          <h2 className="font-display text-3xl text-black md:text-4xl xl:text-5xl">Process</h2>
          <p className="mt-3 max-w-prose text-[#6b6b6b]">
            Consultation → Concept → Design → Execution
          </p>
        </Reveal>

        <ol className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 md:mt-12 lg:grid-cols-4">
          {site.process.map((step, i) => (
            <Reveal key={step.step} delay={i * 80}>
              <li className="min-w-0">
                <p className="font-display text-4xl text-[#c4b8a5]">{step.step}</p>
                <h3 className="mt-3 text-lg break-words text-black">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed break-words text-[#5c5c5c]">
                  {step.text}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <Reveal>
        <div className="mt-16 flex flex-col gap-3 border-t border-black/10 pt-10 sm:flex-row sm:flex-wrap md:mt-20 md:pt-12">
          <Link href="/contact" className="btn-primary">
            Start a project
          </Link>
          <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="btn-whatsapp">
            WhatsApp
          </a>
        </div>
      </Reveal>
    </div>
  );
}
