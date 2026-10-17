import { cn } from "@/utils/cn";

/** Four equal squares — Lucide-style “Squares” grid used as the NexGen mark. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("h-10 w-10 shrink-0", className)} aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="38" height="38" rx="8" fill="#0A2A1A" />
      <rect x="1" y="1" width="38" height="38" rx="8" fill="none" stroke="#A3E635" strokeOpacity=".55" />
      <rect x="8" y="8" width="10" height="10" rx="1.5" fill="#A3E635" />
      <rect x="22" y="8" width="10" height="10" rx="1.5" fill="#A3E635" />
      <rect x="8" y="22" width="10" height="10" rx="1.5" fill="#A3E635" />
      <rect x="22" y="22" width="10" height="10" rx="1.5" fill="#A3E635" />
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
