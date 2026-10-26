import HomeStyleQuiz from "@/components/HomeStyleQuiz";
import Reveal from "@/components/Reveal";
import { getAllProjects } from "@/lib/projects";
import { STYLES } from "@/lib/quiz";
import { site } from "@/lib/site";

export const metadata = {
  title: "Which home suits you?",
  description: `A 1-minute quiz to find your home style, with matching projects from ${site.name}.`,
};

export default function QuizPage() {
  const all = getAllProjects();
  const projects = Object.fromEntries(
    STYLES.map((style) => {
      const p = all.find((x) => x.slug === style.projectSlug);
      return [style.id, p ? { slug: p.slug, title: p.title, cover: p.cover } : null];
    }),
  );

  return (
    <div className="site-container site-section scroll-mt-24">
      <Reveal>
        <header className="mb-10 max-w-2xl md:mb-14">
          <p className="text-xs uppercase tracking-[0.18em] text-[#6b6b6b]">1-minute quiz</p>
          <h1 className="mt-3 font-display text-4xl break-words text-black md:text-6xl xl:text-7xl">
            Which home suits you?
          </h1>
          <p className="mt-4 max-w-prose text-base text-[#6b6b6b] md:text-lg">
            Five quick questions. We will show you the style of home that fits the way you live,
            and a project to look at.
          </p>
        </header>
      </Reveal>
      <div className="max-w-3xl">
        <HomeStyleQuiz projects={projects} />
      </div>
    </div>
  );
}
