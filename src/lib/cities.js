/**
 * City-level map data (approximate centres). No exact site addresses are published.
 * Edited from the admin: "Site settings → Map & cities".
 */
import mapData from "../../content/settings/map.json";

export const CITIES = (Array.isArray(mapData.cities) ? mapData.cities : [])
  .filter((c) => c && c.name && Number.isFinite(Number(c.lat)) && Number.isFinite(Number(c.lng)))
  .map((c) => {
    const name = String(c.name).trim();
    const keys = String(c.keywords || "")
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);
    return {
      name,
      lat: Number(c.lat),
      lng: Number(c.lng),
      // The city name itself always matches a project's location text.
      keys: keys.includes(name.toLowerCase()) ? keys : [name.toLowerCase(), ...keys],
    };
  });

export function cityFromLocation(location = "") {
  const text = String(location).toLowerCase();
  return CITIES.find((c) => c.keys.some((k) => text.includes(k))) ?? null;
}

/** Earlier work listed on the CV (city-level only). */
export const EARLIER_WORKS = (Array.isArray(mapData.earlier) ? mapData.earlier : []).filter(
  (w) => w && w.name && w.city,
);
