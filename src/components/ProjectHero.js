"use client";

import { useEffect, useState } from "react";
import ProjectNumber from "./ProjectNumber";
import RevealImage from "./RevealImage";
import RevealText from "./RevealText";

/**
 * Cover with soft parallax + number → title cascade + RevealImage wipe.
 */
export default function ProjectHero({ project }) {
  const [ready, setReady] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setReady(true), 40);

    function onScroll() {
      setOffset(reduce ? 0 : Math.min(window.scrollY * 0.18, 80));
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="relative min-h-[70dvh] w-full overflow-hidden bg-[#1a1a1a] md:min-h-[85dvh]">
      {project.cover ? (
        <div
          className="absolute inset-[-6%] will-change-transform"
          style={{ transform: `translate3d(0, ${offset}px, 0)` }}
        >
          <div className={`absolute inset-0 ${project.coverZoom ? "hero-zoomout" : ""}`}>
            <RevealImage
              src={project.cover}
              mobileSrc={project.coverMobile}
              alt={`${project.title} cover`}
              aspect="auto"
              priority
              sizes="100vw"
            />
          </div>
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

      <div className="site-container absolute inset-x-0 bottom-0 pb-8 md:pb-12">
        <div className="flex items-end gap-4 md:gap-6">
          <div className={`hero-line ${ready ? "hero-line-visible" : ""}`}>
            <ProjectNumber
              number={project.number}
              tone="light"
              className="text-5xl leading-none md:text-7xl xl:text-8xl"
            />
          </div>
          <div className="min-w-0 pb-1">
            <p
              className={`hero-line text-xs uppercase tracking-[0.18em] text-white/70 ${ready ? "hero-line-visible" : ""}`}
              style={{ transitionDelay: ready ? "120ms" : "0ms" }}
            >
              Project {project.number}
              {project.category ? ` · ${project.category}` : ""}
              {project.year ? ` · ${project.year}` : ""}
            </p>
            <RevealText
              as="h1"
              className="mt-2 max-w-4xl font-display text-4xl break-words text-white md:text-6xl xl:text-7xl"
              delay={0.18}
              stagger={0.08}
            >
              {project.title}
            </RevealText>
          </div>
        </div>
      </div>
    </div>
  );
}
