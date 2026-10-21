"use client";

import { useMemo, useState } from "react";
import ProjectCard from "./ProjectCard";

const CATEGORIES = ["All", "Residential", "Commercial", "Interior", "Other"];

export default function CategoryFilter({ projects }) {
  const [active, setActive] = useState("All");

  const filtered = useMemo(() => {
    if (active === "All") return projects;
    return projects.filter((p) => p.category === active);
  }, [active, projects]);

  return (
    <div className="min-w-0">
      <div
        className="-mx-4 mb-10 flex gap-4 overflow-x-auto px-4 pb-1 whitespace-nowrap sm:mx-0 sm:mb-12 sm:gap-5 sm:overflow-visible sm:px-0 sm:whitespace-normal md:mb-14 md:flex-wrap md:gap-6"
        role="tablist"
        aria-label="Filter by category"
      >
        {CATEGORIES.map((category) => {
          const selected = active === category;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(category)}
              className={`inline-flex min-h-11 shrink-0 items-center px-1 py-2 text-sm tracking-[0.08em] transition sm:px-2 ${
                selected
                  ? "border-b-2 border-black font-medium text-black"
                  : "border-b-2 border-transparent text-[#6b6b6b] [@media(hover:hover)]:hover:text-black"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-[#6b6b6b]">No projects in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-14">
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
