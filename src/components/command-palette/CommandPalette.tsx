import { useEffect, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Highlight } from "./Highlight";
import { useDebounce } from "../../hooks/useDebounce";
import { useToast } from "../../hooks/useToast";
import { useTheme } from "../../hooks/useTheme"; // ✅ ایمپورت درست
import { people, type Person } from "../../lib/data";
import { EmptyState } from "../ui/EmptyState";
import { Kbd } from "../ui/Kbd";

type ActionItem = {
  id: string;
  label: string;
  hint: string;
  run: () => void;
};

type Entry =
  | { kind: "action"; item: ActionItem }
  | { kind: "person"; item: Person };

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 150);
  const reduced = useReducedMotion();
  const { addToast } = useToast();
  const { toggle } = useTheme(); // ← ✅ از هوک اصلی

  const actions: ActionItem[] = useMemo(
    () => [
      {
        id: "toggle-theme",
        label: "Toggle theme",
        hint: "⌘",
        run: () => {
          toggle();
          addToast({ variant: "info", title: "Theme switched" });
        },
      },
      {
        id: "copy-email",
        label: "Copy first member's email",
        hint: "⌘",
        run: () => {
          const email = people[0]?.email ?? "";
          void navigator.clipboard?.writeText(email).then(
            () =>
              addToast({
                variant: "success",
                title: "Email copied",
                description: email,
              }),
            () => addToast({ variant: "error", title: "Copy failed" }),
          );
        },
      },
      {
        id: "view-profile",
        label: "View first member's profile",
        hint: "↵",
        run: () => {
          addToast({
            variant: "info",
            title: "Profile view is a demo action",
            description: "Wire this up to your routing layer.",
          });
        },
      },
    ],
    [toggle, addToast],
  );

  const filteredActions = useMemo(() => {
    const q = (debouncedQuery ?? "").trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => a.label.toLowerCase().includes(q));
  }, [debouncedQuery, actions]);

  const results = useMemo(() => {
    const q = (debouncedQuery ?? "").trim().toLowerCase();
    if (!q) return people;
    return people.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q),
    );
  }, [debouncedQuery]);

  const flatItems: { kind: "action" | "person"; item: ActionItem | Person }[] =
    useMemo(
      () => [
        ...filteredActions.map((a) => ({ kind: "action" as const, item: a })),
        ...results.map((p) => ({ kind: "person" as const, item: p })),
      ],
      [filteredActions, results],
    );

  useEffect(() => setActiveIndex(0), [debouncedQuery]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);


  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // بررسی کلید فیزیکی K و کلیدهای متناسب با مک (metaKey) و ویندوز/لینوکس (ctrlKey)
      if (e.code === "KeyK" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        e.stopPropagation();
        setOpen((o) => !o);
      }
    };

    // اضافه کردن { capture: true } برای رهگیری رویداد در بالاترین اولویت
    window.addEventListener("keydown", onKey, { capture: true });
    return () =>
      window.removeEventListener("keydown", onKey, { capture: true });
  }, []);

  function runEntry(entry: Entry) {
  if (entry.kind === "action") {
    entry.item.run();
    setOpen(false);
  } else {
    // Person
    addToast({
      variant: "success",
      title: `Selected ${entry.item.name}`,
      description: entry.item.email,
    });
  }
}

  const runItem = (entry: CommandEntry) => {
    if (entry.kind === "action") {
      if (entry.item.id === "toggle-theme") {
        entry.item.run();
        // اینجا setOpen(false) اجرا نمی‌شود چون در شرط نیست
      } else {
        // entry.item.run();
        setOpen(false); // فقط برای اکشن‌های دیگر بسته شود
      }
    } else {
      const p = entry.item;
      addToast({
        variant: "success",
        title: `Selected ${p.name} — ${p.role}`,
        description: p.email,
      });
    }
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const count = flatItems.length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (count ? (i + 1) % count : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (count ? (i - 1 + count) % count : 0));
    } else if (e.key === "Enter" && flatItems[activeIndex]) {
      e.preventDefault();
      runItem(flatItems[activeIndex]);
    }
  };

  useEffect(() => {
    const el =
      listRef.current?.querySelectorAll<HTMLElement>("[role='option']")[
        activeIndex
      ];
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, flatItems.length]);

  const clearQuery = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const totalCount = results.length + filteredActions.length;

  const itemVariants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: reduced
        ? { duration: 0 }
        : { delay: i * 0.03, duration: 0.2 },
    }),
    exit: reduced
      ? { opacity: 0 }
      : { opacity: 0, y: -4, transition: { duration: 0.12 } },
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="flex w-full items-center justify-between rounded-xl border border-zinc-200/80 bg-zinc-50/50 px-4 py-2.5 text-sm text-zinc-500 shadow-inner transition-all hover:bg-zinc-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400 dark:hover:bg-zinc-900">
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Search commands or people…
          </span>
          <Kbd>
            <span className="text-[10px]">⌘</span>K
          </Kbd>
        </button>
      </Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.15 }}
                className="fixed inset-0 z-50 bg-zinc-950/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild onKeyDown={onKeyDown}>
              <motion.div
                initial={
                  reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -12 }
                }
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={
                  reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -12 }
                }
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className="fixed left-1/2 top-24 z-50 w-[min(36rem,92vw)] -translate-x-1/2 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-3 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
              >
                <Dialog.Title className="sr-only">Command Palette</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Search team members and actions
                </Dialog.Description>

                <div className="relative flex items-center border-b border-zinc-100 pb-2 dark:border-zinc-800">
                  <svg
                    className="ml-2 h-4 w-4 shrink-0 text-zinc-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    ref={inputRef}
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type a name or role…"
                    aria-label="Search commands or people"
                    className="w-full bg-transparent px-3 py-2 text-sm outline-none placeholder:text-zinc-400 dark:text-zinc-100"
                  />
                  {query && (
                    <button
                      onClick={clearQuery}
                      aria-label="Clear search"
                      className="rounded-md px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-zinc-800"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <p aria-live="polite" className="sr-only">
                  {totalCount} result{totalCount === 1 ? "" : "s"} found
                </p>
                <p className="mt-2 px-1 text-xs text-zinc-400">
                  Showing {totalCount} of {people.length + actions.length} items
                </p>

                <ul
                  ref={listRef}
                  role="listbox"
                  aria-label="Results"
                  className="mt-1 max-h-72 space-y-1 overflow-y-auto pr-1"
                >
                  {filteredActions.length > 0 && (
                    <li
                      aria-hidden="true"
                      className="px-3 pt-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400"
                    >
                      Actions
                    </li>
                  )}
                  <AnimatePresence initial={false}>
                    {filteredActions.map((a, i) => (
                      <motion.li
                        key={a.id}
                        role="option"
                        aria-selected={i === activeIndex}
                        custom={i}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        onMouseEnter={() => setActiveIndex(i)}
                        onClick={() => runItem({ kind: "action", item: a })}
                        className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${
                          i === activeIndex
                            ? "bg-indigo-50 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-200"
                            : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                          </span>
                          {a.label}
                        </span>
                        <Kbd>{a.hint}</Kbd>
                      </motion.li>
                    ))}
                  </AnimatePresence>

                  {results.length > 0 && (
                    <li
                      aria-hidden="true"
                      className="px-3 pt-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400"
                    >
                      People
                    </li>
                  )}
                  <AnimatePresence initial={false}>
                    {results.map((p, j) => {
                      const i = filteredActions.length + j;
                      return (
                        <motion.li
                          key={p.id}
                          role="option"
                          aria-selected={i === activeIndex}
                          custom={j}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          layout
                          onMouseEnter={() => setActiveIndex(i)}
                          onClick={() => runItem({ kind: "person", item: p })}
                          className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${
                            i === activeIndex
                              ? "bg-indigo-50 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-200"
                              : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                              {p.name.charAt(0)}
                            </span>
                            <span>
                              <span className="block font-medium">
                                <Highlight
                                  text={p.name}
                                  query={debouncedQuery}
                                />
                              </span>
                              <span className="block text-xs text-zinc-400">
                                <Highlight
                                  text={p.role}
                                  query={debouncedQuery}
                                />
                              </span>
                            </span>
                          </span>
                          <Kbd>↵ Select</Kbd>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>

                  {totalCount === 0 && (
                    <li>
                      <EmptyState
                        icon={
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        }
                        title="No matching results"
                        description={`Nothing found for "${debouncedQuery ?? query}". Try a different name or role, or clear the search.`}
                        action={
                          <button
                            onClick={clearQuery}
                            className="mt-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                          >
                            Clear search
                          </button>
                        }
                      />
                    </li>
                  )}
                </ul>

                <div className="mt-2 flex items-center justify-end gap-2 border-t border-zinc-100 pt-2 dark:border-zinc-800">
                  <Kbd>↑</Kbd>
                  <Kbd>↓</Kbd>
                  <span className="text-xs text-zinc-400">to navigate</span>
                  <Kbd className="ml-2">↵</Kbd>
                  <span className="text-xs text-zinc-400">to select</span>
                  <Kbd className="ml-2">Esc</Kbd>
                  <span className="text-xs text-zinc-400">to close</span>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
