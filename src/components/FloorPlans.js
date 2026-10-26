"use client";

import { useState } from "react";
import Lightbox from "./Lightbox";
import Reveal from "./Reveal";
import RevealText from "./RevealText";
import { responsiveSrcSet } from "@/lib/responsiveImage";

/**
 * Floor-plan viewer: one tab per floor, tap the drawing to enlarge.
 * Plans are shown whole (never cropped) on a white sheet.
 */
export default function FloorPlans({ plans = [], title = "Project" }) {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(null);

  if (!plans.length) return null;

  const plan = plans[current] ?? plans[0];
  const srcs = plans.map((p) => p.src);
  const captions = plans.map((p) => p.title);

  return (
    <section className="border-y border-black/10 bg-[#f0eee9]">
      <div className="site-container py-14 md:py-20">
        <div className="max-w-2xl space-y-3">
          <RevealText
            as="h2"
            className="font-display text-3xl text-black md:text-4xl xl:text-5xl"
          >
            Floor plans
          </RevealText>
          <Reveal>
            <p className="text-sm leading-relaxed text-[#6b6b6b] md:text-base">
              Choose a floor, then tap the drawing to enlarge it.
            </p>
          </Reveal>
        </div>

        <div
          role="tablist"
          aria-label={`${title} floors`}
          className="mt-8 flex flex-wrap gap-2"
        >
          {plans.map((p, i) => {
            const active = i === current;
            return (
              <button
                key={p.src}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCurrent(i)}
                className={`border px-4 py-2 text-xs uppercase tracking-[0.14em] transition ${
                  active
                    ? "border-black bg-black text-white"
                    : "border-black/20 bg-transparent text-black [@media(hover:hover)]:hover:border-black"
                }`}
              >
                {p.title.split(" — ")[0]}
              </button>
            );
          })}
        </div>

        <figure className="mt-6 min-w-0">
          <button
            type="button"
            className="block w-full cursor-zoom-in border border-black/10 bg-white p-0 text-left"
            onClick={() => setOpen(current)}
            aria-label={`Enlarge ${plan.title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={plan.src}
              src={plan.src}
              srcSet={responsiveSrcSet(plan.src)}
              sizes="(max-width: 1280px) 100vw, 1200px"
              alt={`${title} — ${plan.title}`}
              className="h-auto w-full select-none"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </button>
          <figcaption className="mt-4 space-y-1">
            <p className="text-xs uppercase tracking-[0.14em] text-[#6b6b6b]">
              {plan.title}
            </p>
            {plan.description ? (
              <p className="max-w-prose text-sm leading-relaxed text-[#3f3f3f] md:text-[15px]">
                {plan.description}
              </p>
            ) : null}
          </figcaption>
        </figure>
      </div>

      <Lightbox
        images={srcs}
        captions={captions}
        index={open}
        onClose={() => setOpen(null)}
        onPrev={() => setOpen((i) => (i === null ? null : (i - 1 + plans.length) % plans.length))}
        onNext={() => setOpen((i) => (i === null ? null : (i + 1) % plans.length))}
        altPrefix={title}
      />
    </section>
  );
}
