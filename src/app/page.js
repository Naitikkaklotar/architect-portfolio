import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import RevealImage from "@/components/RevealImage";
import RevealText from "@/components/RevealText";
import { getFeaturedProjects } from "@/lib/projects";
import homeData from "../../content/pages/home.json";
import { site, whatsappUrl } from "@/lib/site";

const home = {
  featuredTitle: homeData.featured_title || "Featured projects",
  featuredText: homeData.featured_text || "",
  servicesTitle: homeData.services_title || "Services",
  toolsTitle: homeData.tools_title || "",
  toolsText: homeData.tools_text || "",
  tools: Array.isArray(homeData.tools) ? homeData.tools.filter((t) => t && t.href && t.title) : [],
  ctaTitle: homeData.cta_title || "Start a project",
  ctaText: homeData.cta_text || "",
};

export const metadata = {
  title: "Home",
  description: site.description,
};

export default function HomePage() {
  const featured = getFeaturedProjects().slice(0, 6);
  const heroProject = featured[0];
  const heroImage = heroProject?.cover || "/uploads/hero.jpg";

  return (
    <>
      <section className="relative -mt-16 min-h-[70dvh] overflow-hidden sm:-mt-20 md:-mt-[5.25rem] md:min-h-[85dvh]">
        <RevealImage
          src={heroImage}
          alt={
            heroProject
              ? `${heroProject.title} — featured project`
              : "KK Architect — architecture photograph"
          }
          aspect="auto"
          priority
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/25" />
        <div className="site-container relative flex min-h-[70dvh] flex-col justify-end pb-12 pt-28 md:min-h-[85dvh] md:pb-16 md:pt-32">
          <RevealText
            as="h1"
            className="max-w-4xl font-display text-4xl tracking-[0.04em] break-words text-white md:text-6xl xl:text-7xl"
            delay={0.05}
            stagger={0.08}
          >
            {site.name}
          </RevealText>
          <p className="animate-rise-delay mt-3 text-sm uppercase tracking-[0.2em] text-white/75 md:text-base">
            {site.architect}
          </p>
          <p className="animate-rise-delay mt-4 max-w-prose text-base font-light break-words text-white/90 md:text-lg">
            {site.tagline}
          </p>
          {heroProject ? (
            <p className="animate-rise-delay mt-6 text-xs uppercase tracking-[0.18em] text-white/70">
              Featured · {heroProject.title}
            </p>
          ) : null}
        </div>
      </section>

      <section className="site-container site-section scroll-mt-24">
        <div className="mb-8 max-w-2xl md:mb-12">
          <RevealText
            as="h2"
            className="font-display text-3xl break-words text-black md:text-4xl xl:text-5xl"
          >
            {home.featuredTitle}
          </RevealText>
          {home.featuredText ? (
            <Reveal>
              <p className="mt-3 max-w-prose text-base text-[#6b6b6b] md:text-lg">
                {home.featuredText}
              </p>
            </Reveal>
          ) : null}
        </div>

        {featured.length === 0 ? (
          <p className="text-[#6b6b6b]">No featured projects yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:gap-x-10 lg:gap-y-14">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} large />
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-black/10 bg-[#f0eee9]">
        <div className="site-container site-section mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="font-display text-3xl leading-snug break-words text-black md:text-4xl xl:text-5xl">
              {site.intro}
            </p>
            <div className="mt-8 flex justify-center md:mt-10">
              <Link href="/projects" className="btn-primary max-w-xs">
                View all projects
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="site-container site-section scroll-mt-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-12">
          <RevealText
            as="h2"
            className="font-display text-3xl text-black md:text-4xl xl:text-5xl"
          >
            {home.servicesTitle}
          </RevealText>
          <Reveal>
            <Link
              href="/services"
              className="inline-flex min-h-11 items-center text-sm tracking-[0.06em] text-[#3f3f3f] underline-offset-4 [@media(hover:hover)]:hover:underline"
            >
              Full services
            </Link>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 lg:gap-10">
          {site.services.map((service, i) => (
            <Reveal key={service.title} delay={i * 90}>
              <div className="min-w-0 border-t border-black/15 pt-6">
                <p className="text-xs tracking-[0.16em] text-[#6b6b6b]">0{i + 1}</p>
                <h3 className="mt-3 font-display text-2xl break-words text-black md:text-3xl">
                  {service.title}
                </h3>
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-[#5c5c5c] md:text-base">
                  {service.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#f0eee9]">
        <div className="site-container py-14 md:py-20">
          <RevealText
            as="h2"
            className="font-display text-3xl break-words text-black md:text-4xl xl:text-5xl"
          >
            {home.toolsTitle}
          </RevealText>
          {home.toolsText ? (
            <Reveal>
              <p className="mt-3 max-w-prose text-base text-[#6b6b6b] md:text-lg">
                {home.toolsText}
              </p>
            </Reveal>
          ) : null}
          <div className="mt-10 grid grid-cols-1 gap-px bg-black/10 md:grid-cols-3">
            {home.tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex min-w-0 flex-col justify-between bg-[#f0eee9] p-6 transition md:p-8 [@media(hover:hover)]:hover:bg-[#e8e6e1]"
              >
                <span className="text-xs uppercase tracking-[0.16em] text-[#6b6b6b]">
                  {tool.label}
                </span>
                <span className="mt-6 block font-display text-2xl break-words text-black md:text-3xl">
                  {tool.title}
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-[#5c5c5c]">
                  {tool.text}
                </span>
                <span className="mt-6 text-sm text-black underline underline-offset-4">Open</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black text-white">
        <div className="site-container flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between md:py-20 lg:py-28">
          <div className="min-w-0">
            <RevealText
              as="h2"
              className="font-display text-3xl break-words md:text-4xl xl:text-5xl"
            >
              {home.ctaTitle}
            </RevealText>
            {home.ctaText ? (
              <Reveal>
                <p className="mt-3 max-w-prose text-base text-white/70 md:text-lg">
                  {home.ctaText}
                </p>
              </Reveal>
            ) : null}
          </div>
          <Reveal delay={100}>
            <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
              <Link
                href="/contact"
                className="inline-flex min-h-12 w-full items-center justify-center bg-white px-5 text-sm tracking-[0.04em] text-black md:w-auto [@media(hover:hover)]:hover:bg-[#f0eee9]"
              >
                Contact KK Architect
              </Link>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp"
              >
                WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
