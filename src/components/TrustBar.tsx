import { motion, useReducedMotion } from "framer-motion";
import { USPS } from "@/data/content";
import { cn } from "@/utils/cn";

const CARD_LAYOUT = [
  "sm:col-span-1 md:col-span-3 lg:col-span-3",
  "sm:col-span-1 md:col-span-3 lg:col-span-2",
  "sm:col-span-1 md:col-span-2 lg:col-span-2",
  "sm:col-span-1 md:col-span-2 lg:col-span-2",
  "sm:col-span-2 md:col-span-2 lg:col-span-3",
];

const IMAGE_POSITION = [
  "object-center",
  "object-center",
  "object-[52%_center]",
  "object-center",
  "object-[50%_58%]",
];

export function TrustBar() {
  const reduceMotion = useReducedMotion();

  return (
    <section aria-labelledby="trust-heading" className="relative overflow-hidden px-4 pb-10 pt-16 sm:px-6 sm:pb-14 sm:pt-20">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-72 -translate-y-1/2 bg-electric/[0.04] blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-5 flex items-center gap-3 sm:mb-7">
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-forest-900 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-electric">
            <span className="h-1.5 w-1.5 rounded-full bg-electric" aria-hidden="true" />
            NexGen / 01–05
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-forest-800/30 to-transparent" aria-hidden="true" />
          <p className="hidden text-xs font-bold uppercase tracking-[0.16em] text-slate-500 md:block">Built differently</p>
        </div>

        <h2 id="trust-heading" className="sr-only">
          Five reasons customers choose NexGen portable staging
        </h2>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-6 lg:grid-cols-12">
          {USPS.map((u, i) => {
            const index = String(i + 1).padStart(2, "0");
            return (
              <motion.li
                key={u.title}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.52, delay: i * 0.07, ease: "easeOut" }}
                className={cn("col-span-1", CARD_LAYOUT[i])}
              >
                <article className="group relative isolate h-full min-h-[292px] overflow-hidden rounded-[26px] bg-forest-950 shadow-[0_18px_45px_-28px_rgba(6,24,15,0.7)] ring-1 ring-forest-950/10 transition duration-500 hover:-translate-y-2 hover:shadow-[0_28px_60px_-24px_rgba(14,56,35,0.7)] focus-within:ring-2 focus-within:ring-electric">
                  <img
                    src={u.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={cn(
                      "absolute inset-0 h-full w-full object-cover saturate-[0.92] transition duration-700 ease-out group-hover:scale-[1.08] group-hover:saturate-110",
                      IMAGE_POSITION[i],
                    )}
                  />

                  {/* The angled shadow mimics the edge of a stage deck. */}
                  <div
                    className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,24,15,0.08)_0%,rgba(6,24,15,0.2)_27%,rgba(6,24,15,0.86)_68%,rgba(6,24,15,0.99)_100%)]"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 h-[58%] bg-[linear-gradient(150deg,rgba(10,42,26,0.12)_0%,rgba(10,42,26,0.9)_34%,rgba(6,24,15,0.98)_100%)] [clip-path:polygon(0_24%,100%_0,100%_100%,0_100%)]"
                    aria-hidden="true"
                  />

                  {/* Lime edge and magnetic connection nodes tie all five cards together. */}
                  <div className="absolute inset-x-0 top-0 z-10 h-[3px] origin-left scale-x-[0.28] bg-electric transition-transform duration-500 group-hover:scale-x-100" aria-hidden="true" />
                  <span className="absolute -left-1.5 top-1/2 z-20 h-3 w-3 -translate-y-1/2 rounded-full bg-electric shadow-[0_0_0_4px_rgba(163,230,53,0.15),0_0_20px_rgba(163,230,53,0.55)]" aria-hidden="true" />
                  <span className="absolute -right-1.5 top-1/2 z-20 h-3 w-3 -translate-y-1/2 rounded-full bg-electric shadow-[0_0_0_4px_rgba(163,230,53,0.15),0_0_20px_rgba(163,230,53,0.55)]" aria-hidden="true" />

                  <div className="relative z-20 flex min-h-[292px] flex-col justify-between p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-forest-950/75 text-electric shadow-xl backdrop-blur-md transition duration-500 group-hover:-rotate-6 group-hover:border-electric/60 group-hover:bg-forest-900">
                        <u.icon className="h-6 w-6" strokeWidth={2.2} aria-hidden="true" />
                      </span>
                      <span className="select-none text-5xl font-extrabold leading-none tracking-[-0.08em] text-white/20 transition duration-500 group-hover:-translate-x-1 group-hover:text-electric/35" aria-hidden="true">
                        {index}
                      </span>
                    </div>

                    <div className="mt-16">
                      <p className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.19em] text-electric">
                        <span className="h-px w-5 bg-electric transition-all duration-500 group-hover:w-9" aria-hidden="true" />
                        {u.caption}
                      </p>
                      <h3 className="max-w-[13rem] text-[22px] font-extrabold leading-[1.08] tracking-tight text-white">
                        {u.title}
                      </h3>
                      <p className="mt-2 max-w-[15rem] text-[13px] font-medium leading-relaxed text-white/75">{u.text}</p>

                      <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-3">
                        <span className="text-[9px] font-extrabold uppercase tracking-[0.24em] text-white/45">NexGen Staging</span>
                        <span className="text-[10px] font-bold text-electric/90" aria-label={`${u.title}: ${u.imageAlt}`}>
                          {index} / 05
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
