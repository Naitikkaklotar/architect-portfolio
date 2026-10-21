"use client";

import Link from "next/link";

/**
 * Clickable markers on a photo (shop-the-look style).
 * Positions are % from top-left of the image box.
 *
 * @param {{ label: string, x: number, y: number, href: string }[]} hotspots
 */
export default function ImageHotspots({ hotspots = [] }) {
  if (!hotspots.length) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {hotspots.map((spot, i) => {
        const x = Math.min(100, Math.max(0, Number(spot.x) || 0));
        const y = Math.min(100, Math.max(0, Number(spot.y) || 0));
        const href = spot.href || spot.link || "";
        if (!href || !spot.label) return null;

        const isExternal = /^https?:\/\//i.test(href);
        const className =
          "pointer-events-auto group absolute -translate-x-1/2 -translate-y-1/2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

        const marker = (
          <>
            <span className="relative flex h-7 w-7 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-white/40" />
              <span className="relative h-3.5 w-3.5 rounded-full border-2 border-white bg-black/70 shadow-sm transition group-hover:scale-110 group-hover:bg-black" />
            </span>
            <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap bg-black/85 px-2.5 py-1 text-[11px] tracking-[0.08em] text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
              {spot.label}
            </span>
          </>
        );

        if (isExternal) {
          return (
            <a
              key={`${spot.label}-${i}`}
              href={href}
              target="_blank"
              rel="noreferrer"
              className={className}
              style={{ left: `${x}%`, top: `${y}%` }}
              aria-label={`View ${spot.label}`}
              onClick={(e) => e.stopPropagation()}
            >
              {marker}
            </a>
          );
        }

        return (
          <Link
            key={`${spot.label}-${i}`}
            href={href}
            className={className}
            style={{ left: `${x}%`, top: `${y}%` }}
            aria-label={`View ${spot.label}`}
            onClick={(e) => e.stopPropagation()}
          >
            {marker}
          </Link>
        );
      })}
    </div>
  );
}
