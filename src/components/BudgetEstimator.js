"use client";

import { useId, useMemo, useState } from "react";
import {
  FINISH_OPTIONS,
  SCOPE_OPTIONS,
  SQFT_PER_VAAR,
  computeEstimate,
  formatInr,
  toSqft,
} from "@/lib/estimate";
import { whatsappUrl } from "@/lib/site";

const fieldClass =
  "mt-2 min-h-12 w-full border border-black/15 bg-white px-4 text-base text-black outline-none transition focus:border-black";

export default function BudgetEstimator({ config }) {
  const uid = useId().replace(/:/g, "");
  const { types, cities, designFee } = config;

  const [typeId, setTypeId] = useState(types[0]?.id ?? "");
  const [cityName, setCityName] = useState(cities[0].city);
  const [unit, setUnit] = useState("sqft");
  const [area, setArea] = useState("2500");
  const [finish, setFinish] = useState("premium");
  const [scope, setScope] = useState("turnkey");
  const [name, setName] = useState("");

  const type = types.find((t) => t.id === typeId) ?? types[0];
  const city = cities.find((c) => c.city === cityName) ?? cities[0];
  const sqft = toSqft(area, unit);

  const result = useMemo(
    () =>
      computeEstimate({
        type,
        finish,
        sqft,
        cityFactor: city.factor,
        designFee,
      }),
    [type, finish, sqft, city.factor, designFee],
  );

  if (!types.length) return null;

  const finishLabel = FINISH_OPTIONS.find((f) => f.id === finish)?.label;
  const scopeLabel = SCOPE_OPTIONS.find((s) => s.id === scope)?.label;
  const headline = result
    ? scope === "turnkey"
      ? `${formatInr(result.build[0])} – ${formatInr(result.build[1])}`
      : `${formatInr(result.fee[0])} – ${formatInr(result.fee[1])}`
    : "—";

  const message = result
    ? [
        `Hello, I used the budget estimator on your website.${name ? ` My name is ${name}.` : ""}`,
        `Project: ${type.label}`,
        `City: ${city.city}`,
        `Built-up area: ${Math.round(sqft).toLocaleString("en-IN")} sq ft`,
        `Finish: ${finishLabel}`,
        `Scope: ${scopeLabel}`,
        scope === "turnkey"
          ? `Indicative turnkey budget: ${headline}`
          : `Indicative design fee: ${headline} (build cost about ${formatInr(result.build[0])} – ${formatInr(result.build[1])})`,
        "Please share the next steps.",
      ].join("\n")
    : "";

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
      <form className="min-w-0 space-y-8" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor={`${uid}-type`} className="text-xs uppercase tracking-[0.16em] text-[#6b6b6b]">
              What are you planning?
            </label>
            <select
              id={`${uid}-type`}
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
              className={fieldClass}
            >
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={`${uid}-city`} className="text-xs uppercase tracking-[0.16em] text-[#6b6b6b]">
              City
            </label>
            <select
              id={`${uid}-city`}
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              className={fieldClass}
            >
              {cities.map((c) => (
                <option key={c.city} value={c.city}>
                  {c.city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={`${uid}-area`} className="text-xs uppercase tracking-[0.16em] text-[#6b6b6b]">
              Built-up area
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id={`${uid}-area`}
                type="number"
                inputMode="numeric"
                min="100"
                max="200000"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="min-h-12 min-w-0 flex-1 border border-black/15 bg-white px-4 text-base text-black outline-none transition focus:border-black"
              />
              <div className="flex shrink-0" role="group" aria-label="Area unit">
                {[
                  { id: "sqft", label: "sq ft" },
                  { id: "vaar", label: "vaar" },
                ].map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    aria-pressed={unit === u.id}
                    onClick={() => setUnit(u.id)}
                    className={`min-h-12 min-w-14 border px-3 text-sm transition ${
                      unit === u.id
                        ? "border-black bg-black text-white"
                        : "border-black/15 bg-white text-black"
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>
            {unit === "vaar" ? (
              <p className="mt-2 text-xs text-[#6b6b6b]">
                1 vaar = {SQFT_PER_VAAR} sq ft → about {Math.round(sqft).toLocaleString("en-IN")} sq ft
              </p>
            ) : null}
          </div>
        </div>

        <Choice
          legend="Finish level"
          options={FINISH_OPTIONS}
          value={finish}
          onChange={setFinish}
        />
        <Choice legend="What do you need?" options={SCOPE_OPTIONS} value={scope} onChange={setScope} />

        <div>
          <label htmlFor={`${uid}-name`} className="text-xs uppercase tracking-[0.16em] text-[#6b6b6b]">
            Your name (optional)
          </label>
          <input
            id={`${uid}-name`}
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
          />
        </div>
      </form>

      <aside className="min-w-0 self-start border border-black/10 bg-[#f0eee9] p-6 sm:p-8 lg:sticky lg:top-28">
        <p className="text-xs uppercase tracking-[0.16em] text-[#6b6b6b]">
          {scope === "turnkey" ? "Indicative turnkey budget" : "Indicative design fee"}
        </p>
        <p
          className="mt-3 font-display text-4xl break-words text-black sm:text-5xl"
          aria-live="polite"
        >
          {headline}
        </p>

        {result ? (
          <dl className="mt-6 space-y-3 border-t border-black/10 pt-5 text-sm">
            <Row label="Project" value={type.label} />
            <Row label="Area" value={`${Math.round(sqft).toLocaleString("en-IN")} sq ft`} />
            <Row label="Finish" value={finishLabel} />
            {scope === "design" ? (
              <Row
                label="Estimated build cost"
                value={`${formatInr(result.build[0])} – ${formatInr(result.build[1])}`}
              />
            ) : (
              <Row label="Design fee" value="Included in turnkey" />
            )}
          </dl>
        ) : (
          <p className="mt-4 text-sm text-[#6b6b6b]">Enter an area of at least 100 sq ft.</p>
        )}

        <p className="mt-6 text-xs leading-relaxed text-[#6b6b6b]">
          Indicative range only, not a quotation. The final cost depends on the site, structure,
          design and material choices.
        </p>

        {result ? (
          <a
            href={whatsappUrl(message)}
            target="_blank"
            rel="noreferrer"
            className="btn-whatsapp mt-6"
          >
            Send this to KK Architect on WhatsApp
          </a>
        ) : null}
      </aside>
    </div>
  );
}

function Choice({ legend, options, value, onChange }) {
  return (
    <fieldset>
      <legend className="text-xs uppercase tracking-[0.16em] text-[#6b6b6b]">{legend}</legend>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {options.map((o) => {
          const active = value === o.id;
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.id)}
              className={`min-h-14 border px-4 py-3 text-left transition ${
                active ? "border-black bg-black text-white" : "border-black/15 bg-white text-black"
              }`}
            >
              <span className="block text-sm">{o.label}</span>
              <span className={`mt-0.5 block text-xs ${active ? "text-white/70" : "text-[#6b6b6b]"}`}>
                {o.hint}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-[#6b6b6b]">{label}</dt>
      <dd className="min-w-0 text-right break-words text-black">{value}</dd>
    </div>
  );
}
