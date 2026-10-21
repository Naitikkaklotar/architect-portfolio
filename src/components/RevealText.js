"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useMemo, useRef } from "react";

const EASE = [0.22, 1, 0.36, 1];
const DURATION = 0.8;
const ALLOWED = new Set(["h1", "h2", "h3", "p"]);

/**
 * Word-mask text reveal (architectural line cascade).
 * Static-export safe (client-only, no server code).
 *
 * @param {"h1"|"h2"|"h3"|"p"} [as="h2"]
 * @param {string} children
 * @param {string} [className]
 * @param {number} [delay=0] seconds before first word
 * @param {number} [stagger=0.1] seconds between words
 */
export default function RevealText({
  as = "h2",
  children,
  className = "",
  delay = 0,
  stagger = 0.1,
}) {
  const Tag = ALLOWED.has(as) ? as : "h2";
  const text = typeof children === "string" ? children : String(children ?? "");
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, {
    once: true,
    margin: "-10% 0px",
  });

  const words = useMemo(
    () => text.trim().split(/\s+/).filter(Boolean),
    [text]
  );

  if (!text.trim()) return null;

  // prefers-reduced-motion: plain text, no animation
  if (reduceMotion) {
    return (
      <Tag ref={ref} className={className}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={className}>
      {/* Screen readers + crawlers read once */}
      <span className="sr-only">{text}</span>

      {/* Visual mask cascade — hidden from AT */}
      <span aria-hidden="true" className="block">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="mr-[0.28em] inline-block overflow-hidden align-bottom last:mr-0"
            style={{ lineHeight: "inherit", paddingBottom: "0.12em", marginBottom: "-0.12em" }}
          >
            <motion.span
              className="inline-block will-change-transform"
              initial={{ y: "110%" }}
              animate={inView ? { y: "0%" } : { y: "110%" }}
              transition={{
                duration: DURATION,
                ease: EASE,
                delay: delay + i * stagger,
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
