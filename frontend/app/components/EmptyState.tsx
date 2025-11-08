interface EmptyStateProps {
  icon?: string;
  title: string;
  helperText: string;
}

const EmptyState = ({ icon = "🔄", title, helperText }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <span aria-hidden="true" className="text-4xl">
        {icon}
      </span>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600">{helperText}</p>
    </div>
  );
};

export default EmptyState;

