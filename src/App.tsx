import { useEffect } from "react";
import { useTheme } from "./hooks/useTheme";
import { CommandPalette } from "./components/command-palette/CommandPalette";
import { DataTable } from "./components/data-table/DataTable";
import { ToastProvider, useToast } from "./hooks/useToast";
import { ToastContainer } from "./components/ui/Toast"; // ✅ ایمپورت صحیح کامپوننت UI
import { people } from "./lib/data";

function MainContent() {
  const { theme, toggle } = useTheme();
  const { addToast } = useToast();

  // Effect برای مدیریت کلیدهای میانبر سراسری (Ctrl+C / Cmd+C)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "c" && (e.metaKey || e.ctrlKey)) {
        // اگر کاربر در حال تایپ در input یا textarea است، مداخله نکن
        const activeEl = document.activeElement;
        const isInput =
          activeEl?.tagName === "INPUT" ||
          activeEl?.tagName === "TEXTAREA" ||
          activeEl?.getAttribute("contenteditable") === "true";

        if (isInput) return;

        // اطمینان از اینکه Command Palette باز نیست
        const isCommandPaletteOpen = document.querySelector('[role="dialog"]');

        if (!isCommandPaletteOpen) {
          e.preventDefault();
          const email = people[0]?.email ?? "";
          if (email) {
            void navigator.clipboard?.writeText(email).then(
              () => {
                addToast({
                  variant: "success",
                  title: "Email copied",
                  description: email,
                });
              },
              () => {
                addToast({ variant: "error", title: "Copy failed" });
              },
            );
          }
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [addToast]);

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-zinc-50/50 text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
        {/* Background Decor */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent blur-3xl" />

        <div className="relative mx-auto max-w-4xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4 border-b border-zinc-200/80 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800/80">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                Interactive Component Matrix
              </h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Accessible, keyboard-friendly data table & command palette
                showcase.
              </p>
            </div>

            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-zinc-200/80 bg-white px-3.5 py-2 text-sm font-medium shadow-sm transition-all hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:self-center dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-100"
            >
              {theme === "dark" ? (
                <>
                  <span className="text-amber-400">☀️</span>
                  <span>Light</span>
                </>
              ) : (
                <>
                  <span className="text-indigo-400">🌙</span>
                  <span>Dark</span>
                </>
              )}
            </button>
          </header>

          {/* Components Grid */}
          <main className="space-y-6">
            <section className="rounded-2xl border border-zinc-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Quick Navigation & Actions
                </span>
                <span className="text-xs text-zinc-400">
                  Press Cmd+K / Ctrl+K
                </span>
              </div>
              <div className="mt-3">
                <CommandPalette />
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-200/80 bg-white/70 shadow-sm backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/50">
              <DataTable />
            </section>
          </main>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainContent />
    </ToastProvider>
  );
}
