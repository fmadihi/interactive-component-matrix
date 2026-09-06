import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createPortal } from "react-dom";
import { useToastState, TOAST_DURATION_MS, type ToastVariant } from "../../hooks/useToast";

const variantStyles: Record<ToastVariant, { ring: string; icon: string; bar: string }> = {
  success: {
    ring: "ring-emerald-500/30",
    icon: "✓",
    bar: "bg-emerald-500",
  },
  error: {
    ring: "ring-red-500/30",
    icon: "✕",
    bar: "bg-red-500",
  },
  info: {
    ring: "ring-indigo-500/30",
    icon: "i",
    bar: "bg-indigo-500",
  },
};

const iconStyles: Record<ToastVariant, string> = {
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  error: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  info: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
};

function ToastItem({ id, title, description, variant }: { id: string; title: string; description?: string; variant: ToastVariant }) {
  const { removeToast } = useToastState();
  const reduced = useReducedMotion();
  const styles = variantStyles[variant];

  return (
    <motion.div
      layout
      role="status"
      initial={reduced ? { opacity: 0 } : { opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, x: 60, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`pointer-events-auto flex w-80 items-start gap-3 overflow-hidden rounded-xl bg-white p-3 shadow-lg ring-1 dark:bg-zinc-900 ${styles.ring}`}
    >
      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${iconStyles[variant]}`}>
        {styles.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{title}</p>
        {description && (
          <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
        )}
      </div>
      <button
        onClick={() => removeToast(id)}
        aria-label="Dismiss notification"
        className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
      >
        ✕
      </button>
      <motion.div
        key={id}
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: reduced ? 0 : TOAST_DURATION_MS / 1000, ease: "linear" }}
        className={`absolute bottom-0 left-0 h-0.5 ${styles.bar}`}
      />
    </motion.div>
  );
}

export function ToastContainer() {
  const { toasts } = useToastState();

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-2"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <div key={t.id} className="relative">
            <ToastItem {...t} />
          </div>
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
}