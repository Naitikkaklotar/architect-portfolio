export const SQFT_PER_VAAR = 9;

export const FINISH_OPTIONS = [
  { id: "standard", label: "Standard", hint: "Good quality, practical finishes" },
  { id: "premium", label: "Premium", hint: "Better materials, custom detailing" },
  { id: "luxury", label: "Luxury", hint: "High-end materials, bespoke design" },
];

export const SCOPE_OPTIONS = [
  { id: "turnkey", label: "Turnkey", hint: "Design, approvals, execution and handover" },
  { id: "design", label: "Design only", hint: "Concept, drawings and site guidance" },
];

/** Round to a clean figure: nearest ₹10k under 10 lakh, otherwise nearest ₹1 lakh. */
function roundMoney(n) {
  const step = n < 1_000_000 ? 10_000 : 100_000;
  return Math.round(n / step) * step;
}

/** ₹ in Indian units: Lakh / Cr. */
export function formatInr(n) {
  if (n >= 10_000_000) {
    const cr = n / 10_000_000;
    return `₹${cr.toFixed(cr >= 10 ? 1 : 2).replace(/\.?0+$/, "")} Cr`;
  }
  if (n >= 100_000) {
    const lakh = n / 100_000;
    return `₹${lakh.toFixed(lakh >= 100 ? 0 : 1).replace(/\.0$/, "")} Lakh`;
  }
  return `₹${Math.round(n / 1000)}k`;
}

export function toSqft(value, unit) {
  const v = Number(value) || 0;
  return unit === "vaar" ? v * SQFT_PER_VAAR : v;
}

/**
 * @returns {{ build: [number, number], fee: [number, number] } | null}
 */
export function computeEstimate({ type, finish, sqft, cityFactor, designFee }) {
  if (!type || !sqft || sqft < 100) return null;
  const [lo, hi] = type.rates[finish] || [0, 0];
  if (!hi) return null;
  const build = [roundMoney(sqft * lo * cityFactor), roundMoney(sqft * hi * cityFactor)];
  const fee = [
    roundMoney((build[0] * designFee[0]) / 100),
    roundMoney((build[1] * designFee[1]) / 100),
  ];
  return { build, fee };
}
