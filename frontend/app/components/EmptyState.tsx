import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: string;
  title: string;
  helperText: string;
  actionSlot?: ReactNode;
  className?: string;
}

const EmptyState = ({
  icon = "🔄",
  title,
  helperText,
  actionSlot,
  className,
}: EmptyStateProps) => {
  const baseStyles =
    "flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center";
  const composedClassName = [baseStyles, className].filter(Boolean).join(" ");

  return (
    <div className={composedClassName}>
      <span aria-hidden="true" className="text-4xl">
        {icon}
      </span>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600">{helperText}</p>
      {actionSlot}
    </div>
  );
};

export default EmptyState;

