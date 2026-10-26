"use client";

import { useState } from "react";
import { responsiveSrcSet } from "@/lib/responsiveImage";
import Reveal from "./Reveal";
import RevealText from "./RevealText";

/**
 * Drag-to-compare slider. The "before" image sits on top and is revealed from the left.
 * Works with mouse, touch and keyboard (it is a real range input underneath).
 */
export default function BeforeAfter({ compare, projectTitle = "Project", aspect = "1/1" }) {
  const [pos, setPos] = useState(50);
  const { before, after, title, caption, beforeLabel, afterLabel } = compare;

  return (
    <section id="compare" className="scroll-mt-20 site-container py-14 md:py-20">
      <div className="max-w-2xl space-y-3">
        <RevealText
          as="h2"
          className="font-display text-3xl text-black md:text-4xl xl:text-5xl"
        >
          {title}
        </RevealText>
        {caption ? (
          <Reveal>
            <p className="text-sm leading-relaxed text-[#6b6b6b] md:text-base">{caption}</p>
          </Reveal>
        ) : null}
      </div>

      <Reveal className="mt-8">
        <div
          className="relative mx-auto w-full max-w-3xl select-none overflow-hidden bg-[#e8e6e1]"
          style={{ aspectRatio: aspect }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={after}
            srcSet={responsiveSrcSet(after)}
            sizes="(max-width: 768px) 100vw, 768px"
            alt={`${projectTitle} — ${afterLabel}`}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={before}
            srcSet={responsiveSrcSet(before)}
            sizes="(max-width: 768px) 100vw, 768px"
            alt={`${projectTitle} — ${beforeLabel}`}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            loading="lazy"
            decoding="async"
            draggable={false}
          />

          <span className="pointer-events-none absolute left-3 top-3 bg-black/70 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-white">
            {beforeLabel}
          </span>
          <span className="pointer-events-none absolute right-3 top-3 bg-black/70 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-white">
            {afterLabel}
          </span>

          <div
            className="pointer-events-none absolute inset-y-0 w-px bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
            style={{ left: `${pos}%` }}
          >
            <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-md">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M9 6l-6 6 6 6M15 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            step="0.5"
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            aria-label={`Compare ${beforeLabel} and ${afterLabel}`}
            className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
            style={{ touchAction: "pan-y" }}
          />
        </div>
      </Reveal>
    </section>
  );
}
