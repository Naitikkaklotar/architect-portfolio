import Link from "next/link";
import ProjectImage from "@/components/ProjectImage";
import Reveal from "@/components/Reveal";
import { getAllProjects } from "@/lib/projects";
import { site } from "@/lib/site";

export const metadata = {
  title: "Gallery",
  description: `Photo gallery of projects by ${site.name}.`,
};

export default function GalleryPage() {
  const projects = getAllProjects();
  const shots = projects.flatMap((project) => {
    const items = [];
    if (project.cover) {
      items.push({
        src: project.cover,
        caption: "Cover",
        project,
      });
    }
    project.images.forEach((img) => {
      items.push({
        src: img.src,
        caption: img.caption || "Photo",
        project,
      });
    });
    return items;
  });

  return (
    <div className="site-container site-section scroll-mt-24">
      <Reveal>
        <header className="mb-8 max-w-2xl md:mb-12">
          <h1 className="font-display text-4xl break-words text-black md:text-6xl xl:text-7xl">
            Gallery
          </h1>
          <p className="mt-4 max-w-prose text-base text-[#6b6b6b] md:text-lg">
            Selected photographs across residential, commercial, and interior work.
          </p>
        </header>
      </Reveal>

      {shots.length === 0 ? (
        <p className="text-[#6b6b6b]">No photos yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {shots.map((shot, i) => (
            <Reveal key={`${shot.src}-${i}`} delay={(i % 6) * 40}>
              <Link
                href={`/projects/${shot.project.slug}`}
                className="group block min-w-0"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#e8e6e1]">
                  <ProjectImage
                    src={shot.src}
                    alt={`${shot.project.title} — ${shot.caption}`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="motion-safe:transition motion-safe:duration-500 [@media(hover:hover)]:group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-4 pt-12">
                    <p className="text-xs uppercase tracking-[0.14em] text-white/90">
                      {shot.caption}
                    </p>
                    <p className="mt-1 font-display text-lg break-words text-white md:text-xl">
                      {shot.project.title}
                    </p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
