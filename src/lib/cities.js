/** City-level map data (approximate centres). No exact site addresses are published. */
export const CITIES = [
  { name: "Surat", lat: 21.1702, lng: 72.8311, keys: ["surat", "adajan", "vesu", "piplod", "althan"] },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, keys: ["ahmedabad", "amdavad"] },
  { name: "Vadodara", lat: 22.3072, lng: 73.1812, keys: ["vadodara", "baroda"] },
  { name: "Mumbai", lat: 19.076, lng: 72.8777, keys: ["mumbai", "bombay", "thane", "navi mumbai"] },
  { name: "Rajkot", lat: 22.3039, lng: 70.8022, keys: ["rajkot"] },
];

export function cityFromLocation(location = "") {
  const text = String(location).toLowerCase();
  return CITIES.find((c) => c.keys.some((k) => text.includes(k))) ?? null;
}

/** Earlier work listed on the CV (city-level only). */
export const EARLIER_WORKS = [
  { name: "Arya Club & Resort", city: "Rajkot" },
  { name: "Arya Family Club", city: "Surat" },
  { name: "Agora City", city: "Vadodara" },
  { name: "Vida 360", city: "Surat" },
];
