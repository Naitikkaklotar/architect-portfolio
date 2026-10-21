import CategoryFilter from "@/components/CategoryFilter";
import Reveal from "@/components/Reveal";
import RevealText from "@/components/RevealText";
import { getAllProjects } from "@/lib/projects";
import { site } from "@/lib/site";

export const metadata = {
  title: "Projects",
  description: `Selected architecture projects by ${site.name}.`,
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="site-container site-section scroll-mt-24">
      <header className="mb-10 max-w-2xl md:mb-14 lg:mb-16">
        <RevealText
          as="h1"
          className="font-display text-4xl break-words text-black md:text-6xl xl:text-7xl"
        >
          Projects
        </RevealText>
        <Reveal>
          <p className="mt-5 max-w-prose text-base leading-relaxed text-[#6b6b6b] md:mt-6 md:text-lg">
            Filter by category. Tap a card to open the full project gallery.
          </p>
        </Reveal>
      </header>
      <CategoryFilter projects={projects} />
    </div>
  );
}
