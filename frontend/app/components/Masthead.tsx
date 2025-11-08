import { ReactNode } from "react";

interface MastheadProps {
  title: string;
  subtitle?: string;
  navigationSlot?: ReactNode;
}

const Masthead = ({ title, subtitle, navigationSlot }: MastheadProps) => {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white/80 px-6 py-6 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
        ) : null}
      </div>
      {navigationSlot ? (
        <nav aria-label="Page navigation">{navigationSlot}</nav>
      ) : null}
    </header>
  );
};

export default Masthead;

