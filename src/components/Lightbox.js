"use client";

import { useEffect, useRef } from "react";

export default function Lightbox({
  images,
  captions = [],
  index,
  onClose,
  onPrev,
  onNext,
  altPrefix,
}) {
  const touchStartX = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (index === null) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [index, onClose, onPrev, onNext]);

  if (index === null || !images?.[index]) return null;

  function onTouchStart(e) {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
  }

  function onTouchEnd(e) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 50) return;
    if (delta > 0) onPrev();
    else onNext();
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex h-dvh items-center justify-center bg-black/95 p-4 motion-safe:animate-fade-in pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button
        ref={closeRef}
        type="button"
        className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center text-sm tracking-wide text-white/80 sm:right-4 sm:top-4"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        Close
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white/80 sm:left-4"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            type="button"
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white/80 sm:right-4"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="Next image"
          >
            →
          </button>
        </>
      )}

      <div
        className="relative flex max-h-[80dvh] w-full max-w-5xl items-center justify-center px-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index]}
          alt={`${altPrefix} — ${captions[index] || `image ${index + 1}`}`}
          className="max-h-[80dvh] w-auto max-w-full object-contain"
        />
      </div>

      <p className="absolute bottom-4 left-1/2 max-w-[90vw] -translate-x-1/2 break-words text-center text-xs text-white/70">
        {captions[index] ? (
          <span className="mb-1 block text-sm tracking-[0.08em] text-white">
            {captions[index]}
          </span>
        ) : null}
        {index + 1} / {images.length}
      </p>
    </div>
  );
}
