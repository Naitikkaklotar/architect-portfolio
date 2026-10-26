"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import RevealText from "./RevealText";
import { responsiveSrcSet } from "@/lib/responsiveImage";

const ZOOM_STEPS = [1, 1.6, 2.4, 3.4];

/** Full-screen plan viewer: zoom buttons + native scroll/drag to pan. */
function PlanViewer({ plans, index, onClose, onChange, title }) {
  // Start zoomed in on phones, where a wide plan would otherwise be tiny.
  const startZoom = () => (typeof window !== "undefined" && window.innerWidth < 640 ? 2 : 0);
  const [zoomIndex, setZoomIndex] = useState(startZoom);
  const closeRef = useRef(null);
  const scrollRef = useRef(null);
  const plan = plans[index];
  const zoom = ZOOM_STEPS[zoomIndex];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onChange((index - 1 + plans.length) % plans.length);
      if (e.key === "ArrowRight") onChange((index + 1) % plans.length);
      if (e.key === "+" || e.key === "=") setZoomIndex((z) => Math.min(z + 1, ZOOM_STEPS.length - 1));
      if (e.key === "-") setZoomIndex((z) => Math.max(z - 1, 0));
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [index, plans.length, onClose, onChange]);

  // Click-and-drag to pan when zoomed (mouse). Touch uses native scrolling.
  const drag = useRef(null);
  function onPointerDown(e) {
    if (e.pointerType !== "mouse" || zoom === 1) return;
    const el = scrollRef.current;
    drag.current = { x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop };
    el.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e) {
    if (!drag.current) return;
    const el = scrollRef.current;
    el.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
    el.scrollTop = drag.current.top - (e.clientY - drag.current.y);
  }
  function onPointerUp() {
    drag.current = null;
  }

  function go(next) {
    setZoomIndex(startZoom());
    onChange(next);
  }

  const btn =
    "flex h-10 min-w-10 items-center justify-center border border-white/30 px-3 text-sm text-white transition disabled:opacity-30 [@media(hover:hover)]:hover:bg-white/10";

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — ${plan.title}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-white">
        <p className="min-w-0 flex-1 truncate text-xs uppercase tracking-[0.14em]">{plan.title}</p>
        <div className="flex items-center gap-2">
          <button type="button" className={btn} onClick={() => go((index - 1 + plans.length) % plans.length)} aria-label="Previous floor">
            ‹
          </button>
          <button type="button" className={btn} onClick={() => go((index + 1) % plans.length)} aria-label="Next floor">
            ›
          </button>
          <button
            type="button"
            className={btn}
            onClick={() => setZoomIndex((z) => Math.max(z - 1, 0))}
            disabled={zoomIndex === 0}
            aria-label="Zoom out"
          >
            −
          </button>
          <button
            type="button"
            className={btn}
            onClick={() => setZoomIndex((z) => Math.min(z + 1, ZOOM_STEPS.length - 1))}
            disabled={zoomIndex === ZOOM_STEPS.length - 1}
            aria-label="Zoom in"
          >
            +
          </button>
          <button ref={closeRef} type="button" className={btn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className={`min-h-0 flex-1 overflow-auto bg-white ${zoom > 1 ? "cursor-grab active:cursor-grabbing" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={plan.src}
          alt={`${title} — ${plan.title}`}
          className="mx-auto block h-auto max-w-none select-none"
          style={{ width: `${zoom * 100}%` }}
          draggable={false}
        />
      </div>
      <p className="px-4 py-2 text-center text-[11px] tracking-[0.08em] text-white/60">
        Use + and − to zoom, then drag or scroll to move around. On a phone, turning it sideways gives a bigger view.
      </p>
    </div>
  );
}

/**
 * Floor-plan viewer: one tab per floor, a room list with sizes, and a zoomable full-screen view.
 * Plans are shown whole (never cropped) on a white sheet.
 */
export default function FloorPlans({ plans = [], title = "Project" }) {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(null);

  if (!plans.length) return null;

  const plan = plans[current] ?? plans[0];
  const hasRooms = plan.rooms?.length > 0;

  return (
    <section id="floor-plans" className="scroll-mt-20 border-y border-black/10 bg-[#f0eee9]">
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
              Choose a floor, then tap the drawing to zoom in.
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

        <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-12 lg:gap-8">
          <figure className={`min-w-0 ${hasRooms ? "lg:col-span-8" : "lg:col-span-12"}`}>
            <button
              type="button"
              className="relative block w-full cursor-zoom-in border border-black/10 bg-white p-0 text-left"
              onClick={() => setOpen(current)}
              aria-label={`Zoom ${plan.title}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={plan.src}
                src={plan.src}
                srcSet={responsiveSrcSet(plan.src)}
                sizes="(max-width: 1024px) 100vw, 800px"
                alt={`${title} — ${plan.title}`}
                className="h-auto w-full select-none"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
              <span className="pointer-events-none absolute bottom-3 right-3 bg-black/75 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-white">
                Tap to zoom
              </span>
            </button>
          </figure>

          <div className={`min-w-0 ${hasRooms ? "lg:col-span-4" : "lg:col-span-12"}`}>
            <p className="text-xs uppercase tracking-[0.14em] text-[#6b6b6b]">{plan.title}</p>
            {plan.description ? (
              <p className="mt-2 max-w-prose text-sm leading-relaxed text-[#3f3f3f] md:text-[15px]">
                {plan.description}
              </p>
            ) : null}
            {hasRooms ? (
              <dl className="mt-5 divide-y divide-black/10 border-y border-black/10">
                {plan.rooms.map((room) => (
                  <div key={room.name} className="flex items-baseline justify-between gap-4 py-2.5">
                    <dt className="min-w-0 text-sm text-black">{room.name}</dt>
                    {room.size ? (
                      <dd className="shrink-0 text-sm tabular-nums text-[#5c5c5c]">{room.size}</dd>
                    ) : null}
                  </div>
                ))}
              </dl>
            ) : null}
            {hasRooms ? (
              <p className="mt-3 text-xs text-[#6b6b6b]">Sizes are in feet and inches, as drawn.</p>
            ) : null}
          </div>
        </div>
      </div>

      {open !== null ? (
        <PlanViewer
          plans={plans}
          index={open}
          title={title}
          onClose={() => setOpen(null)}
          onChange={(i) => {
            setOpen(i);
            setCurrent(i);
          }}
        />
      ) : null}
    </section>
  );
}
