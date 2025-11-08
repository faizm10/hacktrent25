const stats = [
  { label: "WPM", value: "—" },
  { label: "Avg Pause", value: "—" },
  { label: "Fillers", value: "—" },
] as const;

const StatsGrid = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-3" role="list">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          role="listitem"
          aria-label={`${stat.label} statistic`}
        >
          <p className="text-sm text-slate-500">{stat.label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;

