"use client";

import { useId, useState } from "react";
import { site, whatsappUrl } from "@/lib/site";

const PROJECT_TYPES = [
  "New villa / bungalow",
  "Weekend home / farmhouse",
  "Residential interior",
  "Commercial / hospital",
  "Renovation",
  "Not sure yet",
];

const CITIES = ["Surat", "Ahmedabad", "Vadodara", "Mumbai", "Rajkot", "Other"];

const fieldClass =
  "mt-2 min-h-12 w-full border border-black/15 bg-white px-4 text-base text-black outline-none transition focus:border-black";

/**
 * Inquiry form that needs no backend: builds a clear message and hands it to
 * WhatsApp or the visitor's email app.
 */
export default function ContactForm() {
  const uid = useId().replace(/:/g, "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState(CITIES[0]);
  const [type, setType] = useState(PROJECT_TYPES[0]);
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState(false);

  const valid = name.trim().length > 1;

  const body = [
    `Hello, my name is ${name.trim() || "—"}.`,
    `Project: ${type}`,
    `City: ${city}`,
    phone.trim() ? `Phone: ${phone.trim()}` : null,
    message.trim() ? `\n${message.trim()}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const whatsappHref = whatsappUrl(body);
  const mailHref = `mailto:${site.email}?subject=${encodeURIComponent(
    `Project inquiry — ${type} (${city})`,
  )}&body=${encodeURIComponent(body)}`;

  function guard(e) {
    if (!valid) {
      e.preventDefault();
      setTouched(true);
    }
  }

  return (
    <form
      className="border border-black/10 bg-[#f0eee9] p-6 sm:p-8 md:p-10"
      onSubmit={(e) => e.preventDefault()}
      noValidate
    >
      <h2 className="font-display text-2xl break-words text-black md:text-3xl">
        Tell us about your project
      </h2>
      <p className="mt-3 max-w-prose text-sm leading-relaxed text-[#5c5c5c] md:text-base">
        Share a few details and send them straight to Keyur on WhatsApp or email. We usually
        reply the same day.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-name`} className="text-xs uppercase tracking-[0.16em] text-[#6b6b6b]">
            Your name
          </label>
          <input
            id={`${uid}-name`}
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={touched && !valid}
            aria-describedby={touched && !valid ? `${uid}-err` : undefined}
            className={fieldClass}
          />
          {touched && !valid ? (
            <p id={`${uid}-err`} className="mt-2 text-sm text-[#9b2c2c]" role="alert">
              Please enter your name.
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${uid}-type`} className="text-xs uppercase tracking-[0.16em] text-[#6b6b6b]">
            Project type
          </label>
          <select
            id={`${uid}-type`}
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={fieldClass}
          >
            {PROJECT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${uid}-city`} className="text-xs uppercase tracking-[0.16em] text-[#6b6b6b]">
            City
          </label>
          <select
            id={`${uid}-city`}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={fieldClass}
          >
            {CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-phone`} className="text-xs uppercase tracking-[0.16em] text-[#6b6b6b]">
            Phone (optional)
          </label>
          <input
            id={`${uid}-phone`}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-msg`} className="text-xs uppercase tracking-[0.16em] text-[#6b6b6b]">
            Plot size, budget or anything else (optional)
          </label>
          <textarea
            id={`${uid}-msg`}
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-2 w-full border border-black/15 bg-white px-4 py-3 text-base text-black outline-none transition focus:border-black"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          onClick={guard}
          className="btn-whatsapp"
        >
          Send on WhatsApp
        </a>
        <a href={mailHref} onClick={guard} className="btn-ghost">
          Send by email
        </a>
      </div>
    </form>
  );
}
