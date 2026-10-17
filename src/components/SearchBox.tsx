import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Flame, Search, SearchX, X } from "lucide-react";
import { CATEGORY_LABEL, POPULAR_SEARCHES, PRODUCTS, type Product } from "@/data/content";
import { formatGBP, scrollToId } from "@/utils/format";
import { cn } from "@/utils/cn";

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Highlight({ text, query }: { text: string; query: string }): ReactNode {
  const words = query.trim().split(/\s+/).filter(Boolean).map(escapeRegExp);
  if (!words.length) return text;
  const parts = text.split(new RegExp(`(${words.join("|")})`, "ig"));
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded-sm bg-electric/60 text-forest-900">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

interface SearchBoxProps {
  className?: string;
  onDone?: () => void;
  autoFocus?: boolean;
}

export function SearchBox({ className, onDone, autoFocus }: SearchBoxProps) {
  const uid = useId();
  const listId = `${uid}-list`;
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return PRODUCTS.filter((p) => {
      const hay = `${p.name} ${CATEGORY_LABEL[p.category]} ${p.blurb}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    }).slice(0, 6);
  }, [q]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => setActive(-1), [q]);

  const choose = (p: Product) => {
    setQ(p.name);
    setOpen(false);
    scrollToId("shop");
    onDone?.();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (results.length ? (a + 1) % results.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (results.length ? (a <= 0 ? results.length - 1 : a - 1) : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && results[active]) choose(results[active]);
      else {
        setOpen(false);
        scrollToId("shop");
        onDone?.();
      }
    } else if (e.key === "Escape") {
      if (open) {
        e.stopPropagation();
        setOpen(false);
      }
    }
  };

  const showPanel = open;
  const hasQuery = q.trim().length > 0;

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <form role="search" aria-label="Search portable staging" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor={`${uid}-input`} className="sr-only">
          Search stage decks, risers, ramps and accessories
        </label>
        <div
          className={cn(
            "flex items-center gap-2 rounded-full border bg-slate-50 pl-4 pr-1.5 transition",
            open ? "border-forest-700 bg-white shadow-[0_0_0_4px_rgba(163,230,53,0.35)]" : "border-slate-200 hover:border-slate-300",
          )}
        >
          <Search className="h-[18px] w-[18px] shrink-0 text-slate-500" aria-hidden="true" />
          <input
            ref={inputRef}
            id={`${uid}-input`}
            type="text"
            role="combobox"
            aria-expanded={showPanel}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? `${uid}-opt-${active}` : undefined}
            autoComplete="off"
            autoFocus={autoFocus}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Search stage decks, risers, ramps…"
            className="h-11 min-w-0 flex-1 bg-transparent text-sm font-medium text-forest-900 outline-none placeholder:text-slate-500 focus-visible:outline-none"
          />
          {hasQuery && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQ("");
                inputRef.current?.focus();
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-200"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          <button
            type="submit"
            aria-label="Search"
            onClick={() => {
              setOpen(false);
              scrollToId("shop");
              onDone?.();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-900 text-electric transition hover:bg-forest-800"
          >
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </form>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white text-forest-900 shadow-2xl shadow-forest-950/20"
          >
            {!hasQuery ? (
              <div className="p-4">
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  <Flame className="h-3.5 w-3.5 text-orange-500" aria-hidden="true" /> Popular searches
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setQ(s);
                        inputRef.current?.focus();
                      }}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-electric hover:text-forest-900"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : results.length ? (
              <ul id={listId} role="listbox" aria-label="Search suggestions" className="max-h-[22rem] overflow-y-auto p-2">
                {results.map((p, i) => (
                  <li
                    key={p.id}
                    id={`${uid}-opt-${i}`}
                    role="option"
                    aria-selected={i === active}
                    onMouseEnter={() => setActive(i)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => choose(p)}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl p-2 transition",
                      i === active ? "bg-forest-50" : "hover:bg-slate-50",
                    )}
                  >
                    <img src={p.image} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" loading="lazy" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        <Highlight text={p.name} query={q} />
                      </span>
                      <span className="block truncate text-xs text-slate-600">{CATEGORY_LABEL[p.category]}</span>
                    </span>
                    <span className="text-sm font-extrabold text-forest-800">{formatGBP(p.price)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div id={listId} role="listbox" aria-label="No results" className="flex items-center gap-3 p-5 text-sm text-slate-600">
                <SearchX className="h-6 w-6 shrink-0 text-slate-400" aria-hidden="true" />
                <p>
                  No matches for “<strong className="text-forest-900">{q}</strong>”. Try “decks”, “riser” or “ramp” — or{" "}
                  <a href="#quote-builder" className="font-bold text-forest-700 underline" onClick={() => setOpen(false)}>
                    build a custom stage quote
                  </a>
                  .
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
