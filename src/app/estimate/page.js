import BudgetEstimator from "@/components/BudgetEstimator";
import Reveal from "@/components/Reveal";
import { getEstimatorConfig } from "@/lib/estimatorConfig";
import { site } from "@/lib/site";

export const metadata = {
  title: "Budget estimator",
  description: `Get an indicative budget for a villa, interior or turnkey project with ${site.name}.`,
};

export default function EstimatePage() {
  const config = getEstimatorConfig();

  return (
    <div className="site-container site-section scroll-mt-24">
      <Reveal>
        <header className="mb-10 max-w-2xl md:mb-14">
          <p className="text-xs uppercase tracking-[0.18em] text-[#6b6b6b]">Plan your project</p>
          <h1 className="mt-3 font-display text-4xl break-words text-black md:text-6xl xl:text-7xl">
            Budget estimator
          </h1>
          {config.intro ? (
            <p className="mt-4 max-w-prose text-base text-[#6b6b6b] md:text-lg">{config.intro}</p>
          ) : null}
        </header>
      </Reveal>
      <BudgetEstimator config={config} />
    </div>
  );
}
