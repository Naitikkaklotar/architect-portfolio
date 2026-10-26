"use client";

import { useMemo, useState } from "react";
import ImageHotspots from "./ImageHotspots";
import Lightbox from "./Lightbox";
import RevealImage from "./RevealImage";

/**
 * Build editorial rows: full-bleed, then a pair, then full, then pair…
 */
function buildRows(images) {
  const rows = [];
  let i = 0;
  let nextIsFull = true;

  while (i < images.length) {
    const remaining = images.length - i;

    if (nextIsFull || remaining === 1) {
      rows.push({
        type: "full",
        items: [{ image: images[i], index: i }],
      });
      i += 1;
      nextIsFull = false;
    } else {
      rows.push({
        type: "pair",
        items: [
          { image: images[i], index: i },
          { image: images[i + 1], index: i + 1 },
        ],
      });
      i += 2;
      nextIsFull = true;
    }
  }

  return rows;
}

function getMeta(img, fallbackIndex) {
  if (typeof img === "string") {
    return {
      src: img,
      caption: `Photo ${fallbackIndex + 1}`,
      description: "",
      hotspots: [],
    };
  }
  return {
    src: img.src,
    caption: img.caption || `Photo ${fallbackIndex + 1}`,
    description: img.description || "",
    hotspots: img.hotspots || [],
  };
}

function GalleryFigure({ meta, index, title, layout, onOpen, priority, aspect }) {
  const isFull = layout === "full";
  const hasHotspots = meta.hotspots?.length > 0;

  return (
    <figure className="flex min-w-0 flex-col gap-4 md:gap-5">
      <div className="relative w-full min-w-0">
        <button
          type="button"
          className="block w-full min-w-0 overflow-hidden border-0 bg-transparent p-0 text-left"
          onClick={() => onOpen(index)}
          aria-label={`Open ${meta.caption}`}
        >
          <RevealImage
            src={meta.src}
            alt={`${title} — ${meta.caption}`}
            aspect={aspect || (isFull ? "16/10" : "4/3")}
            priority={priority}
            sizes={isFull ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
          />
        </button>
        {hasHotspots ? <ImageHotspots hotspots={meta.hotspots} /> : null}
      </div>

      <figcaption
        className={`space-y-2 px-0.5 ${isFull ? "md:max-w-2xl" : ""}`}
      >
        <p className="text-xs uppercase tracking-[0.14em] text-[#6b6b6b]">
          {String(index + 1).padStart(2, "0")} · {meta.caption}
          {hasHotspots ? " · Tap the markers" : ""}
        </p>
        {meta.description ? (
          <p className="max-w-prose text-sm leading-relaxed break-words text-[#3f3f3f] md:text-[15px]">
            {meta.description}
          </p>
        ) : (
          <p className="max-w-prose text-sm leading-relaxed text-[#5c5c5c]">
            {meta.caption} from {title}.
          </p>
        )}
      </figcaption>
    </figure>
  );
}

export default function Gallery({ images = [], title = "Project", aspect = "" }) {
  const [active, setActive] = useState(null);
  const rows = useMemo(() => buildRows(images), [images]);
  // Fixed-ratio mode (e.g. square renders): a simple two-column grid, no full-bleed rows.
  const uniform = Boolean(aspect);

  if (!images.length) {
    return (
      <p className="text-sm text-[#6b6b6b]">No gallery photos for this project yet.</p>
    );
  }

  const srcs = images.map((img) => (typeof img === "string" ? img : img.src));
  const captions = images.map((img) =>
    typeof img === "string" ? "" : img.caption || ""
  );

  function prev() {
    setActive((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }

  function next() {
    setActive((i) => (i === null ? null : (i + 1) % images.length));
  }

  return (
    <>
      {uniform ? (
        <div className="grid min-w-0 grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:gap-x-12">
          {images.map((image, index) => (
            <GalleryFigure
              key={`uniform-${index}`}
              meta={getMeta(image, index)}
              index={index}
              title={title}
              layout="pair"
              aspect={aspect}
              onOpen={setActive}
              priority={index < 2}
            />
          ))}
        </div>
      ) : (
      <div className="flex min-w-0 flex-col gap-12 md:gap-16 lg:gap-20">
        {rows.map((row, rowIndex) => {
          if (row.type === "full") {
            const { image, index } = row.items[0];
            const meta = getMeta(image, index);
            return (
              <div key={`full-${index}`} className="w-full min-w-0">
                <GalleryFigure
                  meta={meta}
                  index={index}
                  title={title}
                  layout="full"
                  onOpen={setActive}
                  priority={index < 1}
                />
              </div>
            );
          }

          return (
            <div
              key={`pair-${rowIndex}`}
              className="grid min-w-0 grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-10 lg:gap-x-12"
            >
              {row.items.map(({ image, index }) => {
                const meta = getMeta(image, index);
                return (
                  <GalleryFigure
                    key={`pair-item-${index}`}
                    meta={meta}
                    index={index}
                    title={title}
                    layout="pair"
                    onOpen={setActive}
                    priority={false}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      )}

      <Lightbox
        images={srcs}
        captions={captions}
        index={active}
        onClose={() => setActive(null)}
        onPrev={prev}
        onNext={next}
        altPrefix={title}
      />
    </>
  );
}
