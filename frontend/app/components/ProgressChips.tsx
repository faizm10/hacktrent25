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
    <ul className="flex flex-wrap gap-3" aria-label="Order progress">
      {chips.map((chip) => {
        return (
          <li key={chip.label}>
            <span
              className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-300"
              style={chip.active ? {
                backgroundColor: '#8B9D83',
                color: '#FFFFFF',
                border: 'none'
              } : {
                backgroundColor: '#C4D0BC',
                color: '#4A3F35',
                border: 'none'
              }}
              aria-label={`${chip.label} ${chip.active ? "completed" : "not completed"}`}
            >
              {chip.active && <span className="mr-2">✓</span>}
              {chip.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default ProgressChips;

