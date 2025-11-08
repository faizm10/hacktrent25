"use client";

import { useRouter } from "next/navigation";
import Card from "../components/Card";
import Masthead from "../components/Masthead";
import PrimaryButton from "../components/PrimaryButton";
import ProgressChips from "../components/ProgressChips";
import ToastPlaceholder from "../components/ToastPlaceholder";
import Toolbar from "../components/Toolbar";
import TranscriptPanel from "../components/TranscriptPanel";
import { BARISTA_PLACEHOLDER } from "../lib/placeholders";
import { ROUTES } from "../lib/routes";

const SessionScreen = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Masthead
        title="Session Practice"
        subtitle="Run through a sample order and track your responses."
        navigationSlot={
          <a
            href={ROUTES.HOME}
            onClick={(event) => {
              event.preventDefault();
              router.push(ROUTES.HOME);
            }}
            className="text-sm font-medium text-indigo-600 underline-offset-4 hover:underline"
          >
            Back to Home
          </a>
        }
      />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <Card>
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Barista</h2>
            <p className="text-sm text-slate-600">{BARISTA_PLACEHOLDER}</p>
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            {/* TODO: replace TranscriptPanel placeholder with live transcript */}
            <TranscriptPanel title="Your Transcript" />
          </div>
        </Card>

        <section aria-labelledby="progress-heading" className="space-y-3">
          <h2 id="progress-heading" className="text-lg font-semibold text-slate-900">
            Order Checklist
          </h2>
          <ProgressChips />
        </section>

        <Toolbar>
          {/* TODO: wire Start to microphone */}
          <PrimaryButton label="Start" />
          <PrimaryButton label="Next Line" variant="neutral" />
          <PrimaryButton
            label="Finish"
            variant="neutral"
            onClick={() => router.push(ROUTES.FEEDBACK)}
          />
        </Toolbar>

        <ToastPlaceholder />
      </main>
    </div>
  );
};

export default SessionScreen;

