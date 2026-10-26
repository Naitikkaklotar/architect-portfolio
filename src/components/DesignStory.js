import Reveal from "./Reveal";
import RevealImage from "./RevealImage";
import RevealText from "./RevealText";

/**
 * Numbered steps (optionally with an image): how the design evolved.
 * Server-safe: no state, only presentational wrappers.
 */
export default function DesignStory({
  id = "story",
  heading = "How the design evolved",
  intro = "",
  steps = [],
  title = "Project",
}) {
  if (!steps.length) return null;

  return (
    <section id={id} className="scroll-mt-20 site-container py-14 md:py-20">
      <div className="max-w-2xl space-y-3">
        <RevealText
          as="h2"
          className="font-display text-3xl text-black md:text-4xl xl:text-5xl"
        >
          {heading}
        </RevealText>
        {intro ? (
          <Reveal>
            <p className="text-sm leading-relaxed text-[#6b6b6b] md:text-base">{intro}</p>
          </Reveal>
        ) : null}
      </div>

      <ol className="mt-10 space-y-12 md:space-y-16">
        {steps.map((step, i) => (
          <li
            key={`${step.title}-${i}`}
            className="grid min-w-0 gap-6 md:grid-cols-12 md:items-center md:gap-10"
          >
            <Reveal
              className={`min-w-0 ${step.image ? "md:col-span-5" : "md:col-span-12"} ${
                i % 2 === 1 && step.image ? "md:order-2 md:col-span-5" : ""
              }`}
            >
              <p className="text-xs uppercase tracking-[0.14em] text-[#6b6b6b]">
                Step {String(i + 1).padStart(2, "0")}
                {step.date ? ` · ${step.date}` : ""}
              </p>
              <h3 className="mt-2 font-display text-2xl text-black md:text-3xl">{step.title}</h3>
              {step.text ? (
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-[#3f3f3f] md:text-base">
                  {step.text}
                </p>
              ) : null}
            </Reveal>
            {step.image ? (
              <div
                className={`min-w-0 md:col-span-7 ${i % 2 === 1 ? "md:order-1" : ""}`}
              >
                <RevealImage
                  src={step.image}
                  alt={`${title} — ${step.title}`}
                  aspect="4/3"
                  sizes="(max-width: 768px) 100vw, 58vw"
                />
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
