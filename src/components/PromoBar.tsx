import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Sparkles, Ticket } from "lucide-react";
import { ECAL_REFERENCE, FUNDING_TIERS } from "@/data/content";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/utils/cn";

export function PromoBar() {
  const { openFunding, funding } = useStore();
  const [expanded, setExpanded] = useState(false);

  return (
    <aside aria-label="Funding announcement" className="relative z-[60] bg-forest-900 text-electric">
      <div className="absolute inset-0 bg-diagonal-lines opacity-70" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-2.5 text-center sm:px-6">
        <p className="flex items-center gap-2 text-[12px] font-semibold leading-snug sm:text-[13px]">
          <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            <strong className="font-extrabold tracking-wide">PORTABLE STAGE FUNDING</strong>
            <span className="text-electric/60"> - </span>
            Education, Charity, Arts &amp; Leisure Orgs receive <strong className="font-extrabold">FUNDING</strong> - of 10% to
            20% discount.
          </span>
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openFunding}
            className="inline-flex items-center gap-1.5 rounded-full bg-electric px-3.5 py-1.5 text-xs font-extrabold text-forest-900 shadow-[0_0_0_0_rgba(163,230,53,0.6)] transition hover:scale-[1.04] hover:bg-lime-300 active:scale-95 animate-glow"
          >
            <Ticket className="h-3.5 w-3.5" aria-hidden="true" />
            {funding ? `${ECAL_REFERENCE} applied` : "Get Code"}
          </button>
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls="promo-details"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold text-electric/90 ring-1 ring-electric/30 transition hover:bg-electric/10"
          >
            {expanded ? "Hide" : "Details"}
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")} aria-hidden="true" />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id="promo-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative overflow-hidden border-t border-electric/15 bg-forest-950/60"
          >
            <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-2 px-4 py-3 text-left sm:px-6 md:grid-cols-4">
              {FUNDING_TIERS.map((t) => (
                <li key={t.id} className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
                  <t.icon className="h-5 w-5 shrink-0 text-electric" aria-hidden="true" />
                  <span className="leading-tight">
                    <span className="block text-sm font-bold text-white">{t.label}</span>
                    <span className="block text-xs font-semibold text-electric">Up to {t.pct}% ECAL funding</span>
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
