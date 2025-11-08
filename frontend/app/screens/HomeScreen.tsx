"use client";

import { useRouter } from "next/navigation";
import PrimaryButton from "../components/PrimaryButton";
import SectionHeading from "../components/SectionHeading";
import { HERO_TAGLINE } from "../lib/placeholders";
import { ROUTES } from "../lib/routes";

const benefits = [
  "Rehearse common coffee shop scenarios in a safe space.",
  "Build confidence with quick, repeatable practice sessions.",
  "Get instant guidance on clarity, pacing, and friendliness.",
] as const;

const HomeScreen = () => {
  const router = useRouter();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-4 py-10 sm:px-6 lg:px-8">
      <section className="space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          EchoLag
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          {HERO_TAGLINE}
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <PrimaryButton
            label="Start Practice"
            onClick={() => router.push(ROUTES.SESSION)}
          />
          <a
            href="#what-is-echolag"
            className="text-sm font-medium text-indigo-600 underline-offset-4 hover:underline"
          >
            What is EchoLag?
          </a>
        </div>
      </section>

      <section
        id="what-is-echolag"
        className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <SectionHeading
          title="Why EchoLag?"
          subtitle="Three reasons to make EchoLag part of your training routine."
        />
        <ul className="mt-6 space-y-3 text-sm text-slate-600">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-indigo-500"
              />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="h-24 rounded-2xl border border-dashed border-slate-300 bg-white/50" />
    </div>
  );
};

export default HomeScreen;

