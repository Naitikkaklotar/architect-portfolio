"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { responsiveSrcSet } from "@/lib/responsiveImage";
import "leaflet/dist/leaflet.css";

const GOLD = "#b08a4a";

/**
 * City-level map of projects. One pin per city (with a count), a chip list for
 * touch devices, and a details panel for the selected city.
 */
export default function ProjectMap({ cities }) {
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const [selected, setSelected] = useState(cities[0]?.name ?? "");

  // create the map once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapEl.current || mapRef.current) return;

      const map = L.map(mapEl.current, {
        scrollWheelZoom: false,
        dragging: !L.Browser.mobile,
        zoomControl: true,
        attributionControl: true,
      }).setView([21.9, 72.6], 7);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 12,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
      }).addTo(map);

      const bounds = [];
      cities.forEach((city) => {
        const count = city.projects.length + city.earlier.length;
        const icon = L.divIcon({
          className: "",
          html: `<div style="width:34px;height:34px;border-radius:9999px;background:${GOLD};color:#fff;display:flex;align-items:center;justify-content:center;font:500 14px/1 Poppins,system-ui,sans-serif;border:3px solid #faf9f7;box-shadow:0 2px 8px rgba(0,0,0,.35)">${count}</div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });
        const marker = L.marker([city.lat, city.lng], {
          icon,
          title: city.name,
          keyboard: true,
          alt: `${city.name} — ${count} projects`,
        }).addTo(map);
        marker.on("click", () => setSelected(city.name));
        markersRef.current[city.name] = marker;
        bounds.push([city.lat, city.lng]);
      });

      if (bounds.length > 1) map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = {};
      }
    };
  }, [cities]);

  function choose(city) {
    setSelected(city.name);
    mapRef.current?.flyTo([city.lat, city.lng], 9, { duration: 0.8 });
  }

  const active = cities.find((c) => c.name === selected) ?? cities[0];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.35fr_0.85fr] lg:gap-12">
      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Choose a city">
          {cities.map((c) => (
            <button
              key={c.name}
              type="button"
              aria-pressed={selected === c.name}
              onClick={() => choose(c)}
              className={`min-h-11 border px-4 text-sm transition ${
                selected === c.name
                  ? "border-black bg-black text-white"
                  : "border-black/15 bg-white text-black"
              }`}
            >
              {c.name} · {c.projects.length + c.earlier.length}
            </button>
          ))}
        </div>
        <div className="relative isolate overflow-hidden border border-black/10 bg-[#e8e6e1]">
          <div
            ref={mapEl}
            className="h-[360px] w-full sm:h-[460px] lg:h-[560px] [&_.leaflet-tile-pane]:grayscale [&_.leaflet-tile-pane]:contrast-[0.95]"
            role="application"
            aria-label="Map of KK Architect projects in Gujarat and Mumbai"
          />
        </div>
        <p className="mt-3 text-xs text-[#6b6b6b]">
          Pins show the city, not the exact site. Tap a city to see its projects.
        </p>
      </div>

      {active ? (
        <aside className="min-w-0" aria-live="polite">
          <p className="text-xs uppercase tracking-[0.18em] text-[#6b6b6b]">Selected city</p>
          <h2 className="mt-2 font-display text-3xl text-black md:text-4xl">{active.name}</h2>

          {active.projects.length > 0 ? (
            <ul className="mt-6 divide-y divide-black/10 border-y border-black/10">
              {active.projects.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="group flex items-center gap-4 py-4"
                  >
                    {p.cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.cover}
                        srcSet={responsiveSrcSet(p.cover)}
                        sizes="96px"
                        alt=""
                        width={96}
                        height={72}
                        loading="lazy"
                        className="h-[72px] w-24 shrink-0 object-cover"
                      />
                    ) : null}
                    <span className="min-w-0">
                      <span className="block text-xs uppercase tracking-[0.14em] text-[#6b6b6b]">
                        {p.number} · {p.category}
                        {p.year ? ` · ${p.year}` : ""}
                      </span>
                      <span className="mt-1 block font-display text-xl break-words text-black md:text-2xl [@media(hover:hover)]:group-hover:opacity-70">
                        {p.title}
                      </span>
                      {p.location ? (
                        <span className="mt-0.5 block text-sm text-[#6b6b6b]">{p.location}</span>
                      ) : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}

          {active.earlier.length > 0 ? (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.16em] text-[#6b6b6b]">Earlier work</p>
              <ul className="mt-2 space-y-1 text-base text-black">
                {active.earlier.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      ) : null}
    </div>
  );
}
