import { cn } from "@/utils/cn";

/**
 * NexGen mark — two concentric lime square rings on a dark teal tile.
 * Bands are each 10% of the tile; the dark centre is 40% (matches the actual logo artwork).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("h-10 w-10 shrink-0", className)} aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="40" height="40" fill="#335151" />
      <rect x="0" y="0" width="40" height="40" fill="#DFF26D" />
      <rect x="4" y="4" width="32" height="32" fill="#335151" />
      <rect x="8" y="8" width="24" height="24" fill="#DFF26D" />
      <rect x="12" y="12" width="16" height="16" fill="#335151" />
    </svg>
  );
}

export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <a
      href="#top"
      aria-label="NexGen Steelcity Stage Modules – back to homepage"
      className={cn("group inline-flex items-center gap-3 rounded-lg", className)}
    >
      <LogoMark className="h-9 w-9 sm:h-10 sm:w-10 transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-105" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-xl font-extrabold tracking-tight sm:text-[22px]",
            tone === "dark" ? "text-forest-900" : "text-white",
          )}
        >
          NEX<span className={tone === "dark" ? "text-forest-500" : "text-electric"}>GEN</span>
        </span>
        <span
          className={cn(
            "mt-1 whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.12em] sm:text-[10px] sm:tracking-[0.2em]",
            tone === "dark" ? "text-slate-500" : "text-white/70",
          )}
        >
          Steelcity Stage Modules
        </span>
      </span>
    </a>
  );
}
