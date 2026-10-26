import Reveal from "./Reveal";
import RevealImage from "./RevealImage";
import RevealText from "./RevealText";

/** Dated updates for an ongoing project (newest last, as entered). */
export default function ProgressTimeline({ steps = [], status = "", title = "Project" }) {
  if (!steps.length) return null;

  return (
    <section id="progress" className="scroll-mt-20 border-y border-black/10 bg-[#f0eee9]">
      <div className="site-container py-14 md:py-20">
        <div className="max-w-2xl space-y-3">
          <RevealText
            as="h2"
            className="font-display text-3xl text-black md:text-4xl xl:text-5xl"
          >
            Project progress
          </RevealText>
          <Reveal>
            <p className="text-sm leading-relaxed text-[#6b6b6b] md:text-base">
              {status ? `Status: ${status}. ` : ""}Updates are added as the project moves forward.
            </p>
          </Reveal>
        </div>

        <ol className="mt-10 border-l border-black/20">
          {steps.map((step, i) => (
            <li key={`${step.title}-${i}`} className="relative pb-10 pl-6 last:pb-0 md:pl-10">
              <span
                aria-hidden="true"
                className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-black"
              />
              <Reveal>
                {step.date ? (
                  <p className="text-xs uppercase tracking-[0.14em] text-[#6b6b6b]">{step.date}</p>
                ) : null}
                <h3 className="mt-1 font-display text-xl text-black md:text-2xl">{step.title}</h3>
                {step.text ? (
                  <p className="mt-2 max-w-prose text-sm leading-relaxed text-[#3f3f3f] md:text-[15px]">
                    {step.text}
                  </p>
                ) : null}
                {step.image ? (
                  <div className="mt-4 max-w-xl">
                    <RevealImage
                      src={step.image}
                      alt={`${title} — ${step.title}`}
                      aspect="4/3"
                      sizes="(max-width: 768px) 100vw, 576px"
                    />
                  </div>
                ) : null}
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
