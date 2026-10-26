import Link from "next/link";
import ProjectMap from "@/components/ProjectMap";
import Reveal from "@/components/Reveal";
import { CITIES, EARLIER_WORKS, cityFromLocation } from "@/lib/cities";
import { getAllProjects } from "@/lib/projects";
import { site } from "@/lib/site";

export const metadata = {
  title: "Project map",
  description: `Where ${site.name} has designed and built — Surat, Ahmedabad, Vadodara, Mumbai and Rajkot.`,
};

export default function MapPage() {
  const projects = getAllProjects();

  const cities = CITIES.map((city) => ({
    name: city.name,
    lat: city.lat,
    lng: city.lng,
    projects: projects
      .filter((p) => cityFromLocation(p.location)?.name === city.name)
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        cover: p.cover,
        number: p.number,
        category: p.category,
        year: p.year,
        location: p.location,
      })),
    earlier: EARLIER_WORKS.filter((w) => w.city === city.name).map((w) => w.name),
  })).filter((c) => c.projects.length + c.earlier.length > 0);

  return (
    <div className="site-container site-section scroll-mt-24">
      <Reveal>
        <header className="mb-10 max-w-2xl md:mb-14">
          <p className="text-xs uppercase tracking-[0.18em] text-[#6b6b6b]">Where we build</p>
          <h1 className="mt-3 font-display text-4xl break-words text-black md:text-6xl xl:text-7xl">
            Project map
          </h1>
          <p className="mt-4 max-w-prose text-base text-[#6b6b6b] md:text-lg">
            Homes, clubs and interiors across Gujarat and Mumbai. Pick a city to see the work.
          </p>
        </header>
      </Reveal>

      {cities.length ? (
        <ProjectMap cities={cities} />
      ) : (
        <p className="text-[#6b6b6b]">No locations to show yet.</p>
      )}

      <p className="mt-12 text-sm text-[#6b6b6b]">
        Building in another city?{" "}
        <Link href="/contact" className="underline underline-offset-4 text-black">
          Tell us about your site
        </Link>
        .
      </p>
    </div>
  );
}
