import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stars } from "@/components/ui/Stars";
import { CLIENTS, REVIEWS } from "@/data/content";
import { cn } from "@/utils/cn";

const HIGHLIGHTS = [
  "Totally magnetic — no locks to replace, ever",
  "Lifespan of up to 15 years",
  "Handcrafted in Sheffield, UK",
];

export function Reviews() {
  const scroller = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [activeDot, setActiveDot] = useState(0);

  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    const card = el.querySelector("li");
    if (card) {
      const step = card.getBoundingClientRect().width + 20;
      setActiveDot(Math.min(REVIEWS.length - 1, Math.round(el.scrollLeft / step)));
    }
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const scrollByCards = (dir: 1 | -1) => {
    const el = scroller.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 20), behavior: "smooth" });
  };

  const goTo = (i: number) => {
    const el = scroller.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    el.scrollTo({ left: i * (card.getBoundingClientRect().width + 20), behavior: "smooth" });
  };

  return (
    <section id="case-studies" aria-labelledby="reviews-heading" className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-forest-50 to-transparent" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <SectionHeading
            className="lg:col-span-7"
            eyebrow="Customer testimonials"
            id="reviews-heading"
            title={
              <>
                Loved by schools, churches &amp; <span className="text-forest-600">venues</span> across the UK
              </>
            }
            description="Don't just take our word for it — read some of our happy customers' comments, straight from the NexGen homepage."
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-forest-900 p-6 text-white shadow-xl shadow-forest-950/20 lg:col-span-5"
          >
            <div className="flex items-center gap-5">
              <div className="text-center">
                <p className="text-5xl font-extrabold leading-none text-electric">5.00</p>
                <p className="mt-1 text-xs font-semibold text-white/70">out of 5</p>
              </div>
              <div className="flex-1">
                <Stars rating={5} size="h-5 w-5" />
                <p className="mt-1.5 text-sm font-semibold text-white/85">Top-rated platforms, scored by our customers</p>
                <ul className="mt-3 space-y-1.5" aria-label="Why customers rate NexGen 5 stars">
                  {HIGHLIGHTS.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-[13px] font-semibold text-white/85">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-electric" aria-hidden="true" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Carousel */}
        <div className="relative mt-12" role="region" aria-roledescription="carousel" aria-label="Customer reviews">
          <ul
            ref={scroller}
            onScroll={update}
            tabIndex={0}
            aria-label="Review list – scroll horizontally"
            className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-6 pt-2 sm:mx-0 sm:px-0"
          >
            {REVIEWS.map((r) => (
              <li key={r.id} className="w-[86%] shrink-0 snap-start sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]">
                <article className="group relative flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-electric hover:shadow-[0_0_0_1px_#a3e635,0_24px_50px_-18px_rgba(132,204,22,0.55)]">
                  <Quote className="absolute right-5 top-5 h-10 w-10 text-forest-100 transition group-hover:text-electric/50" fill="currentColor" aria-hidden="true" />
                  <Stars rating={r.rating} size="h-[18px] w-[18px]" />
                  <h3 className="mt-3 pr-8 text-lg font-extrabold leading-snug text-forest-900">{r.title}</h3>
                  <blockquote className="mt-2 flex-1 text-[15px] leading-relaxed text-slate-600">“{r.text}”</blockquote>
                  <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-900 text-sm font-extrabold text-electric">
                      {r.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold text-forest-900">{r.name}</p>
                      <p className="truncate text-xs text-slate-600">{r.role}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-forest-50 px-2.5 py-1 text-[11px] font-bold text-forest-700 ring-1 ring-forest-200">
                      <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Verified buyer
                    </span>
                    <span className="text-[11px] font-medium text-slate-600">{r.product}</span>
                  </div>
                </article>
              </li>
            ))}
          </ul>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2" role="group" aria-label="Choose review">
              {REVIEWS.map((r, i) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to review ${i + 1}`}
                  aria-current={activeDot === i}
                  className={cn("h-2.5 rounded-full transition-all", activeDot === i ? "w-8 bg-forest-800" : "w-2.5 bg-slate-300 hover:bg-slate-400")}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollByCards(-1)}
                disabled={!canPrev}
                aria-label="Previous reviews"
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-forest-900 text-forest-900 transition hover:bg-forest-900 hover:text-electric disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:hover:bg-transparent disabled:hover:text-slate-400"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCards(1)}
                disabled={!canNext}
                aria-label="Next reviews"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-900 text-electric transition hover:bg-forest-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Client logos */}
        <div className="mt-16">
          <h3 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            NexGen staging in use — schools, choirs, churches, theatres &amp; events
          </h3>
          <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
            <ul className="group flex w-max animate-marquee items-center gap-4 hover:[animation-play-state:paused]">
              {[...CLIENTS, ...CLIENTS].map((c, i) => (
                <li
                  key={`${c.name}-${i}`}
                  aria-hidden={i >= CLIENTS.length}
                  className="flex h-[88px] w-[168px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 grayscale transition hover:border-electric hover:grayscale-0 hover:shadow-[0_10px_30px_-16px_rgba(10,42,26,0.35)]"
                >
                  <img src={c.logo} alt={c.name} className="max-h-12 max-w-[132px] object-contain" loading="lazy" />
                  <span className="sr-only">{c.name} — {c.type}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
