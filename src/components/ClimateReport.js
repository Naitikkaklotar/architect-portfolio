"use client";

import { useId, useState } from "react";

const GOLD = "#b08a4a";

function formatHour(h) {
  const hour = Math.floor(h);
  const mins = Math.round((h - hour) * 60);
  const suffix = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${String(mins).padStart(2, "0")} ${suffix}`;
}

/** Illustrative share of peak west-wall sun (0–1) through the day. */
function westExposure(h) {
  if (h <= 12) return 0;
  const raw =
    Math.pow((h - 12) / 6, 0.7) * Math.pow(Math.max(Math.sin((Math.PI * (h - 6)) / 12), 0), 0.4);
  return Math.min(1, raw / 0.57);
}

function phaseText(h, screenName) {
  if (h < 11) {
    return "Morning: soft east light enters the living spaces. No screening needed — daylight does the work.";
  }
  if (h < 13) {
    return "Midday: the sun is high. Deep overhangs and curved balconies shade the glass from direct summer sun.";
  }
  return `Afternoon: the west sun is the hardest to manage. The ${screenName.toLowerCase()} takes the heat and glare and passes soft, diffused light inside.`;
}

/**
 * Climate report for a project: key benefits, an interactive sun-path diagram,
 * and numbered sustainable features. Data comes from project front matter.
 */
export default function ClimateReport({ climate }) {
  const uid = useId().replace(/:/g, "");
  const [hour, setHour] = useState(16);
  if (!climate) return null;

  const { intro, benefits = [], features = [], screenName = "Jaali screen", screenCut = 78 } =
    climate;

  const t = (hour - 6) / 12;
  const sunX = 240 - 200 * Math.cos(Math.PI * t);
  const sunY = 210 - 150 * Math.sin(Math.PI * t);
  const west = hour > 12;
  const exposure = westExposure(hour);
  const withScreen = exposure * (1 - screenCut / 100);

  // where the ray lands on the building
  const target = west ? { x: 308, y: 170 } : hour < 11 ? { x: 188, y: 170 } : { x: 240, y: 102 };
  const rayOpacity = hour <= 6.2 || hour >= 17.8 ? 0.15 : 0.55;

  return (
    <section id="climate" className="scroll-mt-20 border-y border-black/10 bg-[#f0eee9]" aria-labelledby={`${uid}-title`}>
      <div className="site-container py-14 md:py-20">
        <p className="text-xs uppercase tracking-[0.18em] text-[#6b6b6b]">Climate report</p>
        <h2
          id={`${uid}-title`}
          className="mt-3 max-w-2xl font-display text-3xl text-black md:text-4xl xl:text-5xl"
        >
          Designed for the sun, not just the look
        </h2>
        {intro ? (
          <p className="mt-4 max-w-prose text-base leading-relaxed text-[#5c5c5c] md:text-lg">
            {intro}
          </p>
        ) : null}

        {benefits.length > 0 ? (
          <dl className="mt-10 grid grid-cols-2 gap-px bg-black/10 lg:grid-cols-4">
            {benefits.map((b) => (
              <div key={b.label} className="flex min-w-0 flex-col justify-between bg-[#f0eee9] py-6 pr-4 md:py-8">
                <dt className="text-xs uppercase tracking-[0.14em] text-[#6b6b6b]">
                  {b.label}
                </dt>
                <dd
                  className="mt-3 font-display text-3xl break-words sm:text-4xl md:text-5xl"
                  style={{ color: GOLD }}
                >
                  {b.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* Sun path */}
          <div className="min-w-0">
            <h3 className="font-display text-2xl text-black md:text-3xl">Follow the sun</h3>
            <p className="mt-2 text-sm text-[#6b6b6b]">
              Drag the slider to move the sun from morning to evening.
            </p>

            <div className="mt-5 border border-black/10 bg-[#faf9f7] p-3 sm:p-4">
              <svg
                viewBox="0 0 480 240"
                className="block h-auto w-full"
                role="img"
                aria-label={`Sun path diagram at ${formatHour(hour)}. West wall shaded by the ${screenName}.`}
              >
                <defs>
                  <pattern id={`${uid}-jaali`} width="6" height="6" patternUnits="userSpaceOnUse">
                    <rect width="6" height="6" fill="#d9d4c8" />
                    <circle cx="3" cy="3" r="1.6" fill="#faf9f7" />
                  </pattern>
                </defs>
                {/* sun path arc */}
                <path
                  d="M 40 210 A 200 150 0 0 1 440 210"
                  fill="none"
                  stroke="#b9b3a6"
                  strokeWidth="1.2"
                  strokeDasharray="4 5"
                />
                {/* ground */}
                <line x1="10" y1="210" x2="470" y2="210" stroke="#8d877a" strokeWidth="1.5" />
                <text x="14" y="230" fontSize="14" fill="#6b6b6b">East</text>
                <text x="428" y="230" fontSize="14" fill="#6b6b6b">West</text>

                {/* building */}
                <rect x="190" y="110" width="100" height="100" fill="#e8e6e1" stroke="#8d877a" />
                <rect x="178" y="101" width="136" height="9" fill="#cfc9bb" stroke="#8d877a" />
                <rect x="200" y="136" width="30" height="44" fill="#f6f1e4" stroke="#8d877a" />
                <rect
                  x="290"
                  y="112"
                  width="16"
                  height="98"
                  fill={`url(#${uid}-jaali)`}
                  stroke="#8d877a"
                />
                <text x="298" y="230" fontSize="14" textAnchor="middle" fill="#6b6b6b">{screenName}</text>

                {/* ray */}
                <line
                  x1={sunX}
                  y1={sunY}
                  x2={target.x}
                  y2={target.y}
                  stroke={GOLD}
                  strokeWidth="1.6"
                  strokeDasharray="5 4"
                  opacity={rayOpacity}
                />
                {/* diffused light through the screen */}
                {west && exposure > 0.05 ? (
                  <line
                    x1="290"
                    y1="170"
                    x2="240"
                    y2="170"
                    stroke={GOLD}
                    strokeWidth="6"
                    opacity={0.12 + withScreen * 0.3}
                  />
                ) : null}
                {/* sun */}
                <circle cx={sunX} cy={sunY} r="15" fill={GOLD} opacity="0.95" />
                <circle cx={sunX} cy={sunY} r="24" fill={GOLD} opacity="0.18" />
              </svg>

              <div className="mt-3 flex items-center gap-4">
                <label htmlFor={`${uid}-hour`} className="sr-only">
                  Time of day
                </label>
                <input
                  id={`${uid}-hour`}
                  type="range"
                  min="6"
                  max="18"
                  step="0.25"
                  value={hour}
                  onChange={(e) => setHour(Number(e.target.value))}
                  aria-valuetext={formatHour(hour)}
                  className="h-11 min-w-0 flex-1 cursor-pointer accent-[#b08a4a]"
                />
                <output className="w-20 shrink-0 text-right text-sm tabular-nums text-black">
                  {formatHour(hour)}
                </output>
              </div>
            </div>

            <p className="mt-4 min-h-[4.5rem] max-w-prose text-sm leading-relaxed text-[#3f3f3f] md:text-base">
              {phaseText(hour, screenName)}
            </p>

            <div className="mt-4 space-y-3" aria-hidden="true">
              <Bar label="West wall — without screen" value={exposure} color="#8d877a" />
              <Bar label={`West wall — with ${screenName.toLowerCase()}`} value={withScreen} color={GOLD} />
            </div>
            <p className="mt-3 text-xs text-[#6b6b6b]">
              Illustrative model based on the design target of about {`${screenCut}%`} less direct
              west sun. Not a measured result.
            </p>
          </div>

          {/* Features */}
          {features.length > 0 ? (
            <div className="min-w-0">
              <h3 className="font-display text-2xl text-black md:text-3xl">
                Sustainable design features
              </h3>
              <ol className="mt-5 divide-y divide-black/10 border-y border-black/10">
                {features.map((f, i) => (
                  <li key={f.title} className="flex gap-4 py-4">
                    <span
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs"
                      style={{ borderColor: GOLD, color: GOLD }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <p className="text-base text-black">{f.title}</p>
                      {f.text ? (
                        <p className="mt-1 text-sm leading-relaxed text-[#5c5c5c]">{f.text}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Bar({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-[#6b6b6b]">
        <span>{label}</span>
        <span className="tabular-nums">{`${Math.round(value * 100)}%`}</span>
      </div>
      <div className="mt-1 h-2 w-full bg-black/10">
        <div
          className="h-full transition-[width] duration-200 ease-out motion-reduce:transition-none"
          style={{ width: `${Math.round(value * 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
