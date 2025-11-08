import { ReactNode } from "react";

interface ToolbarProps {
  children: ReactNode;
}

const Toolbar = ({ children }: ToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center justify-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      {children}
    </div>
  );
};

export default Toolbar;

