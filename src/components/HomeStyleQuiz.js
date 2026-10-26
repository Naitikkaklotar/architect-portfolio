"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { QUESTIONS, scoreQuiz } from "@/lib/quiz";
import { whatsappUrl } from "@/lib/site";

/**
 * @param {{ projects: Record<string, { title: string, cover: string, slug: string } | null> }} props
 *   matched projects, keyed by style id (resolved on the server)
 */
export default function HomeStyleQuiz({ projects }) {
  const [answers, setAnswers] = useState([]);
  const topRef = useRef(null);

  const step = answers.length;
  const done = step >= QUESTIONS.length;
  const question = QUESTIONS[step];

  function focusTop() {
    requestAnimationFrame(() =>
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  }

  function pick(optionIndex) {
    setAnswers((a) => [...a, optionIndex]);
    focusTop();
  }

  function back() {
    setAnswers((a) => a.slice(0, -1));
  }

  function restart() {
    setAnswers([]);
    focusTop();
  }

  if (done) {
    const { best, second } = scoreQuiz(answers);
    const project = projects[best.id];
    const summary = QUESTIONS.map(
      (q, i) => `• ${q.title} ${q.options[answers[i]].label}`,
    ).join("\n");
    const message = `Hello, I took the home style quiz on your website. My result: ${best.name}.\n\n${summary}\n\nI would like to talk about my project.`;

    return (
      <div ref={topRef} className="scroll-mt-28">
        <p className="text-xs uppercase tracking-[0.18em] text-[#6b6b6b]">Your result</p>
        <h2 className="mt-3 font-display text-4xl break-words text-black md:text-6xl">
          {best.name}
        </h2>
        <p className="mt-5 max-w-prose text-base leading-relaxed text-[#3f3f3f] md:text-lg">
          {best.summary}
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {best.traits.map((t) => (
            <li key={t} className="border border-black/15 px-3 py-1.5 text-sm text-black">
              {t}
            </li>
          ))}
        </ul>

        {project ? (
          <Link
            href={`/projects/${project.slug}`}
            className="group mt-10 grid grid-cols-1 gap-4 border border-black/10 bg-[#f0eee9] sm:grid-cols-[minmax(0,16rem)_1fr]"
          >
            {project.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.cover}
                alt=""
                loading="lazy"
                className="aspect-[4/3] h-full w-full object-cover"
              />
            ) : null}
            <span className="flex min-w-0 flex-col justify-center p-5 sm:p-6">
              <span className="text-xs uppercase tracking-[0.16em] text-[#6b6b6b]">
                A project like this
              </span>
              <span className="mt-2 font-display text-2xl break-words text-black md:text-3xl [@media(hover:hover)]:group-hover:opacity-70">
                {project.title}
              </span>
              <span className="mt-2 text-sm underline underline-offset-4">View project</span>
            </span>
          </Link>
        ) : (
          <p className="mt-10 max-w-prose border border-black/10 bg-[#f0eee9] p-5 text-sm text-[#5c5c5c]">
            We design homes like this on request. Tell us about your site and we will share
            references.
          </p>
        )}

        {second && second.id !== best.id ? (
          <p className="mt-6 text-sm text-[#6b6b6b]">
            Also close to your taste: <span className="text-black">{second.name}</span>.
          </p>
        ) : null}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={whatsappUrl(message)}
            target="_blank"
            rel="noreferrer"
            className="btn-whatsapp"
          >
            Send my result on WhatsApp
          </a>
          <Link href="/estimate" className="btn-primary">
            Estimate my budget
          </Link>
          <button type="button" onClick={restart} className="btn-ghost">
            Retake the quiz
          </button>
        </div>
      </div>
    );
  }

  const progress = Math.round((step / QUESTIONS.length) * 100);

  return (
    <div ref={topRef} className="scroll-mt-28">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-[#6b6b6b]">
        <span>
          Question {step + 1} of {QUESTIONS.length}
        </span>
        {step > 0 ? (
          <button
            type="button"
            onClick={back}
            className="min-h-11 px-2 underline underline-offset-4 [@media(hover:hover)]:hover:text-black"
          >
            Back
          </button>
        ) : null}
      </div>
      <div
        className="mt-2 h-px w-full bg-black/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-label="Quiz progress"
      >
        <div
          className="h-px bg-[#b08a4a] transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h2 className="mt-8 font-display text-3xl break-words text-black md:text-5xl">
        {question.title}
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {question.options.map((o, i) => (
          <button
            key={o.label}
            type="button"
            onClick={() => pick(i)}
            className="min-h-20 border border-black/15 bg-white p-5 text-left transition [@media(hover:hover)]:hover:border-black [@media(hover:hover)]:hover:bg-[#f0eee9]"
          >
            <span className="block text-base text-black md:text-lg">{o.label}</span>
            <span className="mt-1 block text-sm text-[#6b6b6b]">{o.hint}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
