"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { responsiveSrcSet } from "@/lib/responsiveImage";

const EASE = [0.22, 1, 0.36, 1];
const DURATION = 0.9;

const wipe = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: DURATION, ease: EASE },
  },
};

const zoom = {
  hidden: { scale: 1.15 },
  visible: {
    scale: 1,
    transition: { duration: DURATION, ease: EASE },
  },
};

/**
 * Architectural image reveal: wipe up + scale settle.
 * Static-export safe (client-only, no server code).
 *
 * @param {string} src
 * @param {string} alt
 * @param {string} [className]
 * @param {string} [aspect="4/3"] CSS aspect-ratio value, or "auto" to fill parent
 * @param {boolean} [priority] Hero / LCP — animate on load, skip scroll wait
 * @param {string} [sizes] Responsive sizes hint for the browser
 * @param {string} [mobileSrc] Optional different image used below 768px wide (e.g. a portrait crop)
 */
export default function RevealImage({
  src,
  alt,
  className = "",
  aspect = "4/3",
  priority = false,
  sizes,
  mobileSrc = "",
}) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, {
    once: true,
    margin: "-10% 0px",
  });

  if (!src) return null;

  const srcSet = responsiveSrcSet(src);
  const mobileSrcSet = mobileSrc ? responsiveSrcSet(mobileSrc) || mobileSrc : "";
  const fillParent = aspect === "auto";
  const play = priority || inView;

  const wrapperClass = [
    "overflow-hidden bg-[#e8e6e1]",
    fillParent ? "absolute inset-0 h-full w-full" : "relative w-full",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const wrapperStyle = fillParent
    ? undefined
    : { aspectRatio: String(aspect).replace(/\s/g, "") };

  const imgClassName =
    "pointer-events-none absolute inset-0 h-full w-full max-w-none object-cover select-none";

  const picture = (
    <picture className="contents">
      {mobileSrc ? (
        <source media="(max-width: 767px)" srcSet={mobileSrcSet} sizes={sizes} />
      ) : null}
      <img
        src={src}
        srcSet={srcSet}
        alt={alt || ""}
        className={imgClassName}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        sizes={sizes}
        draggable={false}
      />
    </picture>
  );

  // prefers-reduced-motion: static image, reserved box (no CLS)
  if (reduceMotion) {
    return (
      <div ref={ref} className={wrapperClass} style={wrapperStyle}>
        {picture}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={wrapperClass}
      style={wrapperStyle}
      variants={wipe}
      initial="hidden"
      animate={play ? "visible" : "hidden"}
    >
      <motion.div
        className="absolute inset-0 h-full w-full origin-center will-change-transform"
        variants={zoom}
      >
        {picture}
      </motion.div>
    </motion.div>
  );
}
