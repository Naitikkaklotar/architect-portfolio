import fs from "fs";
import path from "path";

const file = path.join(process.cwd(), "content/settings/estimator.json");

const FINISHES = ["standard", "premium", "luxury"];

/** Read and sanitise the editable estimator settings (server-side, build time). */
export function getEstimatorConfig() {
  let raw = {};
  try {
    raw = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    raw = {};
  }

  const types = (Array.isArray(raw.types) ? raw.types : [])
    .filter((t) => t && t.id && t.label)
    .map((t) => ({
      id: String(t.id),
      label: String(t.label),
      rates: Object.fromEntries(
        FINISHES.map((f) => [f, [Number(t[`${f}_low`]) || 0, Number(t[`${f}_high`]) || 0]]),
      ),
    }))
    .filter((t) => FINISHES.every((f) => t.rates[f][1] > 0));

  const cities = (Array.isArray(raw.city_factors) ? raw.city_factors : [])
    .filter((c) => c && c.city)
    .map((c) => ({ city: String(c.city), factor: Number(c.factor) || 1 }));

  return {
    intro: raw.intro ? String(raw.intro) : "",
    types,
    cities: cities.length ? cities : [{ city: "Surat", factor: 1 }],
    designFee: [Number(raw.design_fee_low) || 4, Number(raw.design_fee_high) || 7],
  };
}
