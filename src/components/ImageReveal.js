"use client";

import useInView from "@/hooks/useInView";

/**
 * Architectural “exposure” — image clarifies as it enters view
 * (like light filling a room).
 */
export default function ImageReveal({
  children,
  className = "",
  delay = 0,
}) {
  const { ref, visible } = useInView({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={`expose ${visible ? "expose-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="expose-media">{children}</div>
    </div>
  );
}
