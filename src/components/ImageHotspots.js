"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const MARKER_CLASS =
  "pointer-events-auto group absolute before:absolute before:-inset-2.5 before:content-[''] -translate-x-1/2 -translate-y-1/2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

function Dot({ label, showLabel = true, open = false }) {
  return (
    <>
      <span className="relative flex h-7 w-7 items-center justify-center">
        <span className="absolute inset-0 hotspot-ping rounded-full bg-white/40" />
        <span
          className={`relative h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm transition group-hover:scale-110 group-hover:bg-black ${
            open ? "scale-110 bg-black" : "bg-black/70"
          }`}
        />
      </span>
      {showLabel ? (
        <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap bg-black/85 px-2.5 py-1 text-[11px] tracking-[0.08em] text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
          {label}
        </span>
      ) : null}
    </>
  );
}

/**
 * Clickable markers on a photo.
 * - `href` only: the marker links to a page (shop-the-look).
 * - `note`: tapping the marker opens a small card with the note (and a link, if `href` is set).
 * Positions are % from top-left of the image box.
 *
 * @param {{ label: string, x: number, y: number, href?: string, note?: string }[]} hotspots
 */
export default function ImageHotspots({ hotspots = [] }) {
  const [openIndex, setOpenIndex] = useState(null);
  const rootRef = useRef(null);

  useEffect(() => {
    if (openIndex === null) return undefined;
    function onPointer(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpenIndex(null);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpenIndex(null);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [openIndex]);

  if (!hotspots.length) return null;

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 z-10">
      {hotspots.map((spot, i) => {
        const x = Math.min(100, Math.max(0, Number(spot.x) || 0));
        const y = Math.min(100, Math.max(0, Number(spot.y) || 0));
        const href = spot.href || spot.link || "";
        const note = spot.note || "";
        if (!spot.label || (!href && !note)) return null;

        const style = { left: `${x}%`, top: `${y}%` };
        const isExternal = /^https?:\/\//i.test(href);

        if (note) {
          const open = openIndex === i;
          const alignRight = x > 62;
          const alignLeft = x < 38;
          const above = y > 62;
          return (
            <div
              key={`${spot.label}-${i}`}
              className="pointer-events-none absolute"
              style={style}
            >
              <button
                type="button"
                className={`${MARKER_CLASS} left-0 top-0`}
                aria-expanded={open}
                aria-label={`${spot.label} — show details`}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenIndex(open ? null : i);
                }}
              >
                <Dot label={spot.label} showLabel={!open} open={open} />
              </button>
              {open ? (
                <div
                  role="dialog"
                  aria-label={spot.label}
                  className={`pointer-events-auto absolute z-30 w-56 max-w-[70vw] bg-white p-4 text-left shadow-lg ${
                    above ? "bottom-5" : "top-5"
                  } ${
                    alignRight
                      ? "right-[-14px]"
                      : alignLeft
                        ? "left-[-14px]"
                        : "left-1/2 -translate-x-1/2"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="font-display text-lg leading-tight text-black">{spot.label}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#3f3f3f]">{note}</p>
                  {href ? (
                    isExternal ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-block text-[11px] uppercase tracking-[0.14em] text-black underline underline-offset-4"
                      >
                        Learn more
                      </a>
                    ) : (
                      <Link
                        href={href}
                        className="mt-3 inline-block text-[11px] uppercase tracking-[0.14em] text-black underline underline-offset-4"
                        onClick={() => setOpenIndex(null)}
                      >
                        Learn more
                      </Link>
                    )
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        }

        if (isExternal) {
          return (
            <a
              key={`${spot.label}-${i}`}
              href={href}
              target="_blank"
              rel="noreferrer"
              className={MARKER_CLASS}
              style={style}
              aria-label={`View ${spot.label}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Dot label={spot.label} />
            </a>
          );
        }

        return (
          <Link
            key={`${spot.label}-${i}`}
            href={href}
            className={MARKER_CLASS}
            style={style}
            aria-label={`View ${spot.label}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Dot label={spot.label} />
          </Link>
        );
      })}
    </div>
  );
}
