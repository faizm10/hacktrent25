"use client";

interface PrimaryButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "neutral";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

const variantStyles: Record<
  NonNullable<PrimaryButtonProps["variant"]>,
  string
> = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600",
  neutral:
    "bg-slate-200 text-slate-900 hover:bg-slate-300 focus-visible:outline-slate-400",
};

const PrimaryButton = ({
  label,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  className,
}: PrimaryButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";
  const variantClass = variantStyles[variant];
  const composedClassName = [baseStyles, variantClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={composedClassName}
    >
      {label}
    </button>
  );
};

export default PrimaryButton;

