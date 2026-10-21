import Link from "next/link";
import ProjectNumber from "./ProjectNumber";
import Reveal from "./Reveal";
import RevealImage from "./RevealImage";

export default function ProjectCard({ project, large = false }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block min-w-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
    >
      <article className="flex min-w-0 flex-col gap-5 md:gap-6">
        <div className="relative w-full min-w-0 overflow-hidden">
          {project.cover ? (
            <RevealImage
              src={project.cover}
              alt={`${project.title} cover`}
              aspect={large ? "3/2" : "4/3"}
              sizes={
                large
                  ? "(max-width: 640px) 100vw, 50vw"
                  : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              }
            />
          ) : (
            <div
              className="flex w-full items-center justify-center bg-[#e8e6e1] text-sm text-[#6b6b6b]"
              style={{ aspectRatio: large ? "3 / 2" : "4 / 3" }}
            >
              No image
            </div>
          )}

          {project.number ? (
            <div className="pointer-events-none absolute left-3 top-3 z-10 md:left-4 md:top-4">
              <ProjectNumber
                number={project.number}
                tone="light"
                className="bg-black/35 px-2.5 py-1 text-lg backdrop-blur-[2px] md:text-xl"
              />
            </div>
          ) : null}
        </div>

        <Reveal>
          <div className="flex min-w-0 flex-col gap-3 px-0.5">
            <div className="flex items-start gap-4">
              <ProjectNumber
                number={project.number}
                className="shrink-0 pt-1 text-2xl md:text-3xl"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="min-w-0 font-display text-2xl leading-tight break-words text-black md:text-3xl [@media(hover:hover)]:group-hover:opacity-70">
                    {project.title}
                  </h3>
                  <span className="shrink-0 pt-1.5 text-xs tracking-[0.14em] text-[#6b6b6b]">
                    {project.year || ""}
                  </span>
                </div>
                <p className="mt-2 text-sm tracking-wide text-[#6b6b6b]">
                  {[project.location, project.category].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>

            {project.excerpt ? (
              <p className="max-w-prose pl-0 text-sm leading-relaxed break-words text-[#4a4a4a] md:pl-12 md:text-[15px]">
                {project.excerpt}
              </p>
            ) : null}
          </div>
        </Reveal>
      </article>
    </Link>
  );
}
