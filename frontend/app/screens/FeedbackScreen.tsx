"use client";

import { useRouter } from "next/navigation";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";
import SectionHeading from "../components/SectionHeading";
import StatsGrid from "../components/StatsGrid";
import { TIPS_PLACEHOLDERS } from "../lib/placeholders";
import { ROUTES } from "../lib/routes";

const FeedbackScreen = () => {
  const router = useRouter();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-slate-900">Session Feedback</h1>
        <p className="text-sm text-slate-600">
          Review your pacing and clarity, then jump back into another round when
          you&apos;re ready.
        </p>
      </header>

      <section aria-labelledby="feedback-stats" className="space-y-6">
        <SectionHeading
          title="Highlights"
          subtitle="A snapshot of how the session went."
        />
        {/* TODO: compute and inject real WPM/pauses/fillers */}
        <StatsGrid />
      </section>

      <Card className="space-y-4">
        <SectionHeading
          title="Tips"
          subtitle="Simple reminders to keep improving each session."
        />
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
          {TIPS_PLACEHOLDERS.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <PrimaryButton
          label="Try Again"
          variant="neutral"
          onClick={() => router.push(ROUTES.SESSION)}
        />
        <PrimaryButton
          label="Back to Home"
          onClick={() => router.push(ROUTES.HOME)}
        />
      </div>
    </div>
  );
};

export default FeedbackScreen;

