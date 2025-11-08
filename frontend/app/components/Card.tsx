import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className }: CardProps) => {
  const baseStyles =
    "rounded-xl border border-slate-200 bg-white p-6 shadow-sm";
  const composedClassName = [baseStyles, className].filter(Boolean).join(" ");

  return <section className={composedClassName}>{children}</section>;
};

export default Card;

