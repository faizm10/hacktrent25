interface ProgressChipsProps {
  drink?: boolean;
  size?: boolean;
  milk?: boolean;
  name?: boolean;
}

const ProgressChips = ({
  drink = false,
  size = false,
  milk = false,
  name = false,
}: ProgressChipsProps) => {
  const chips = [
    { label: "Drink", active: drink },
    { label: "Size", active: size },
    { label: "Milk", active: milk },
    { label: "Name", active: name },
  ];

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Order progress">
      {chips.map((chip) => {
        const variantClass = chip.active
          ? "border-indigo-200 bg-indigo-50 text-indigo-700"
          : "border-slate-200 bg-white text-slate-600";

        return (
          <li key={chip.label}>
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${variantClass}`}
              aria-label={`${chip.label} ${chip.active ? "completed" : "not completed"}`}
            >
              {chip.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default ProgressChips;

