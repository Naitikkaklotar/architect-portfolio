import Link from "next/link";
import ProjectImage from "@/components/ProjectImage";
import Reveal from "@/components/Reveal";
import RevealText from "@/components/RevealText";
import { site } from "@/lib/site";

export const metadata = {
  title: "About",
  description: `About ${site.name} — practice, approach, and place.`,
};

export default function AboutPage() {
  const { about } = site;

  return (
    <div className="site-container site-section scroll-mt-24">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-12 lg:gap-16 md:items-start">
        <Reveal>
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#e8e6e1]">
            <ProjectImage
              src="/uploads/architect.jpg"
              alt={`${site.name} — architect portrait`}
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
            />
          </div>
          <p className="mt-4 text-sm break-words text-[#6b6b6b]">{about.role}</p>
        </Reveal>

        <div className="min-w-0">
          <RevealText
            as="h1"
            className="font-display text-4xl break-words text-black md:text-6xl xl:text-7xl"
          >
            About
          </RevealText>
          <Reveal>
            <p className="mt-4 font-display text-2xl break-words text-black md:text-3xl">
              {site.architect}
            </p>
            <p className="mt-1 text-sm tracking-[0.08em] text-[#6b6b6b]">{site.name}</p>
            <div className="mt-8 space-y-5 text-base leading-relaxed break-words text-[#3f3f3f] md:text-lg">
              {about.bio.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="max-w-prose">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          <RevealText
            as="h2"
            className="mt-12 font-display text-3xl text-black md:mt-14 md:text-4xl"
          >
            Philosophy
          </RevealText>
          <Reveal delay={80}>
            <p className="mt-4 max-w-prose text-base leading-relaxed break-words text-[#3f3f3f] md:text-lg">
              {about.philosophy}
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2">
            <Reveal delay={40}>
              <SectionList title="Experience" items={about.experience} />
            </Reveal>
            <Reveal delay={80}>
              <SectionList title="Education" items={about.education} />
            </Reveal>
            <Reveal delay={120}>
              <SectionList title="Awards" items={about.awards} />
            </Reveal>
            <Reveal delay={160}>
              <SectionList title="Certifications" items={about.certifications} />
            </Reveal>
          </div>

          <Reveal delay={100}>
            <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={site.cvUrl} className="btn-ghost" download>
                Download CV / profile
              </a>
              <Link href="/contact" className="btn-primary">
                Get in touch
              </Link>
            </div>
            <p className="mt-3 text-xs break-words text-[#6b6b6b]">
              Place your PDF at <code className="text-[11px]">public/cv.pdf</code> to enable the
              download.
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function SectionList({ title, items }) {
  return (
    <div className="min-w-0">
      <h3 className="text-xs uppercase tracking-[0.16em] text-[#6b6b6b]">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#3f3f3f]">
        {items.map((item) => (
          <li key={item} className="border-t border-black/10 pt-3 break-words">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
