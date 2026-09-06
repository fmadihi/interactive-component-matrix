import type { ReactNode } from "react";

type KbdProps = {
  children: ReactNode;
  className?: string;
};

export function Kbd({ children, className = "" }: KbdProps) {
  return (
    <kbd
      className={`inline-flex items-center gap-0.5 rounded-md border border-zinc-200 bg-white px-1.5 py-0.5 text-[11px] font-semibold text-zinc-500 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 ${className}`}
    >
      {children}
    </kbd>
  );
}