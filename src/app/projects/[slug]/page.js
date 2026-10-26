import Link from "next/link";
import { notFound } from "next/navigation";
import ClimateReport from "@/components/ClimateReport";
import FloorPlans from "@/components/FloorPlans";
import Gallery from "@/components/Gallery";
import ProjectHero from "@/components/ProjectHero";
import ProjectNumber from "@/components/ProjectNumber";
import Reveal from "@/components/Reveal";
import RevealText from "@/components/RevealText";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import {
  getAdjacentProjects,
  getProjectBySlug,
  getProjectSlugs,
} from "@/lib/projects";
import { site, whatsappUrl } from "@/lib/site";

export async function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return { title: "Project not found" };
  }

  const description = `${project.category}${project.location ? ` in ${project.location}` : ""}${
    project.year ? `, ${project.year}` : ""
  }. A project by ${site.name}.`;

  return {
    title: project.title,
    description,
    openGraph: {
      title: project.title,
      description,
      images: project.cover ? [{ url: project.cover }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
      images: project.cover ? [project.cover] : undefined,
    },
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const { prev, next } = getAdjacentProjects(slug);

  const info = [
    { label: "Category", value: project.category },
    { label: "Location", value: project.location },
    { label: "Year", value: project.year ? String(project.year) : null },
    { label: "Area", value: project.area },
    { label: "Role", value: project.role },
    { label: "Status", value: project.status },
  ].filter((item) => item.value);

  return (
    <article className="min-w-0">
      <ProjectHero project={project} />

      <Reveal>
        <div className="border-b border-black/10 bg-[#f0eee9]">
          <dl className="site-container grid grid-cols-2 gap-4 py-6 sm:grid-cols-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-6 md:py-8">
            <div className="min-w-0">
              <dt className="text-[11px] uppercase tracking-[0.14em] text-[#6b6b6b]">
                No.
              </dt>
              <dd className="mt-2">
                <ProjectNumber number={project.number} className="text-2xl" />
              </dd>
            </div>
            {info.map((item) => (
              <div key={item.label} className="min-w-0">
                <dt className="text-[11px] uppercase tracking-[0.14em] text-[#6b6b6b]">
                  {item.label}
                </dt>
                <dd className="mt-2 text-sm break-words text-black">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>

      <div className="site-container space-y-8 py-14 md:space-y-10 md:py-20 scroll-mt-24">
        <div className="max-w-2xl space-y-3">
          <RevealText
            as="h2"
            className="font-display text-3xl text-black md:text-4xl xl:text-5xl"
          >
            Gallery
          </RevealText>
          <Reveal>
            <p className="text-sm leading-relaxed text-[#6b6b6b] md:text-base">
              Photos with a short note below each image — tap a photo to enlarge.
            </p>
          </Reveal>
        </div>
        <Gallery
          images={project.images}
          title={project.title}
          aspect={project.galleryAspect}
        />
      </div>

      <div className="site-container py-12 md:py-16 lg:py-20 scroll-mt-24">
        <div className="mx-auto max-w-prose">
          <RevealText
            as="h2"
            className="font-display text-3xl text-black md:text-4xl"
          >
            The design
          </RevealText>
          <Reveal>
            <div
              className="prose-project mt-6 text-base md:mt-8 md:text-lg"
              dangerouslySetInnerHTML={{ __html: project.contentHtml }}
            />
          </Reveal>
        </div>
      </div>

      {project.plans.length > 0 ? (
        <FloorPlans plans={project.plans} title={project.title} />
      ) : null}

      {project.climate ? <ClimateReport climate={project.climate} /> : null}

      {project.video ? (
        <div className="site-container space-y-6 pb-12 md:pb-16">
          <RevealText
            as="h2"
            className="font-display text-3xl text-black md:text-4xl"
          >
            Walkthrough
          </RevealText>
          <Reveal>
            <YouTubeEmbed url={project.video} title={`${project.title} video`} />
          </Reveal>
        </div>
      ) : null}

      {(prev || next) && (
        <div className="border-y border-black/10">
          <div className="site-container grid grid-cols-1 md:grid-cols-2">
            {prev ? (
              <Link
                href={`/projects/${prev.slug}`}
                className="group border-b border-black/10 py-8 transition md:border-b-0 md:border-r md:py-10 [@media(hover:hover)]:hover:bg-[#f0eee9]"
              >
                <p className="text-xs uppercase tracking-[0.14em] text-[#6b6b6b]">
                  Previous · {prev.number}
                </p>
                <p className="mt-2 font-display text-2xl break-words text-black md:text-3xl [@media(hover:hover)]:group-hover:opacity-70">
                  {prev.title}
                </p>
              </Link>
            ) : (
              <div className="hidden md:block" />
            )}
            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="group py-8 text-left transition md:py-10 md:pl-8 md:text-right [@media(hover:hover)]:hover:bg-[#f0eee9]"
              >
                <p className="text-xs uppercase tracking-[0.14em] text-[#6b6b6b]">
                  Next · {next.number}
                </p>
                <p className="mt-2 font-display text-2xl break-words text-black md:text-3xl [@media(hover:hover)]:group-hover:opacity-70">
                  {next.title}
                </p>
              </Link>
            ) : null}
          </div>
        </div>
      )}

      <div className="site-container flex flex-col gap-6 py-12 md:flex-row md:items-center md:justify-between md:py-16 lg:py-20">
        <div className="min-w-0">
          <RevealText
            as="h2"
            className="font-display text-3xl break-words text-black md:text-4xl"
          >
            Start a project
          </RevealText>
          <p className="mt-2 text-[#6b6b6b]">Ready to discuss a site or brief?</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
          <Link href="/contact" className="btn-primary">
            Contact KK Architect
          </Link>
          <a
            href={whatsappUrl(`Hello, I saw ${project.title} and would like to discuss a project.`)}
            target="_blank"
            rel="noreferrer"
            className="btn-whatsapp"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
