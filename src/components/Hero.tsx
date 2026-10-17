import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Flag, Hammer, PauseCircle, PlayCircle, Ticket, Timer } from "lucide-react";
import { HERO_FEATURES, HERO_SLIDES } from "@/data/content";
import { useStore } from "@/context/StoreContext";
import { Stars } from "@/components/ui/Stars";
import { cn } from "@/utils/cn";

const SLIDES = HERO_SLIDES.map((s) => ({ ...s, pos: "50% 55%" }));

export function Hero() {
  const { openFunding } = useStore();
  const reduce = useReducedMotion();
  const [slide, setSlide] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const paused = hovering || userPaused;
  const [feature, setFeature] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Mouse parallax (springs keep the depth effect buttery smooth)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const imgX = useTransform(sx, (v) => v * -14);
  const imgY = useTransform(sy, (v) => v * -10);
  const cardX = useTransform(sx, (v) => v * 22);
  const cardY = useTransform(sy, (v) => v * 16);
  const geoX = useTransform(sx, (v) => v * -34);
  const geoY = useTransform(sy, (v) => v * -24);

  const onMove = (e: React.PointerEvent) => {
    if (reduce) return;
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  useEffect(() => {
    if (paused || reduce) return;
    const t = window.setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5500);
    return () => window.clearInterval(t);
  }, [paused, reduce]);

  const current = SLIDES[slide];
  const ActiveIcon = HERO_FEATURES[feature].icon;

  return (
    <section
      ref={sectionRef}
      onPointerMove={onMove}
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-forest-900 pb-28 pt-12 text-white sm:pt-16 lg:bg-forest-950 lg:pb-44 lg:pt-20"
    >
      {/* ---------- Backgrounds (desktop slanted split) ---------- */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-800 to-forest-950 lg:hidden" aria-hidden="true" />
      <div className="absolute inset-y-0 left-0 z-[5] hidden w-[64.8%] clip-slant-r bg-gradient-to-r from-transparent via-electric/40 to-electric lg:block" aria-hidden="true" />
      <div className="absolute inset-y-0 left-0 z-10 hidden w-[64%] clip-slant-r overflow-hidden bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950 lg:block" aria-hidden="true">
        <div className="absolute inset-0 bg-grid-lime" />
        <div className="absolute -left-24 top-1/3 h-[420px] w-[420px] rounded-full bg-electric/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent" />
      </div>
      <div className="absolute inset-0 -z-10 bg-grid-lime opacity-60 lg:hidden" aria-hidden="true" />

      {/* ---------- Left content ---------- */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-[620px]">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-electric/10 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-electric ring-1 ring-electric/40 backdrop-blur sm:text-xs"
          >
            <Flag className="h-3.5 w-3.5" aria-hidden="true" />
            Portable Staging, Handcrafted in Sheffield
          </motion.p>

          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-5"
          >
            <span className="block text-lg font-bold tracking-wide text-white/90 sm:text-xl">NexGen Portable Staging.</span>
            <span className="mt-2 block text-[40px] font-extrabold leading-[1.04] tracking-tight sm:text-5xl xl:text-[58px]">
              <span className="text-gradient-lime">Light-speed</span> modular stage assembly.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
          >
            <strong className="font-bold text-white">Fast, Eco-Friendly, UK-Made Magnetic Portable Stage</strong> — lighter, faster, safer and longer
            lasting. Platforms from 7.2kg, load weight up to 1,500kg, child-safe friendly corners, and a lifespan of up to 15 years.
          </motion.p>

          {/* Interactive 4-icon feature grid */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-7"
          >
            <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4" aria-label="Key features">
              {HERO_FEATURES.map((f, i) => {
                const active = feature === i;
                return (
                  <li key={f.id} className="h-full">
                    <button
                      type="button"
                      aria-pressed={active}
                      onMouseEnter={() => setFeature(i)}
                      onFocus={() => setFeature(i)}
                      onClick={() => setFeature(i)}
                      className={cn(
                        "group relative flex h-full w-full flex-col items-start gap-2.5 overflow-hidden rounded-2xl border p-3.5 text-left transition duration-300 hover:-translate-y-1",
                        active
                          ? "border-electric bg-electric/15 shadow-[0_0_0_1px_rgba(163,230,53,0.5),0_12px_36px_-10px_rgba(163,230,53,0.55)]"
                          : "border-white/15 bg-white/[0.06] hover:border-electric/60 hover:bg-white/10",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl transition duration-300",
                          active ? "bg-electric text-forest-900 rotate-[-6deg] scale-110" : "bg-white/10 text-electric",
                        )}
                      >
                        <f.icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="leading-tight">
                        <span className="block text-sm font-extrabold text-white">{f.title}</span>
                        <span className="mt-0.5 block text-xs font-medium text-white/70">{f.short}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 flex min-h-[44px] items-start gap-2.5 rounded-xl bg-black/20 px-3.5 py-2.5 text-[13px] leading-snug text-white/85 ring-1 ring-white/10" aria-live="polite">
              <ActiveIcon className="mt-0.5 h-4 w-4 shrink-0 text-electric" aria-hidden="true" />
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={feature} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }}>
                  {HERO_FEATURES[feature].detail}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="/shop/"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-electric px-7 py-4 text-base font-extrabold text-forest-900 transition hover:-translate-y-0.5 hover:bg-lime-300 active:translate-y-0 animate-glow"
            >
              <span className="absolute inset-y-0 left-0 w-1/3 bg-white/50 blur-md animate-shine" aria-hidden="true" />
              <span className="relative">Shop Now</span>
              <ArrowRight className="relative h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a
              href="#quote-builder"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-electric hover:bg-white/15"
            >
              <Hammer className="h-5 w-5 text-electric" aria-hidden="true" />
              Build Custom Stage Quote
            </a>
          </motion.div>
        </div>
      </div>

      {/* ---------- Right: product hero showcase ---------- */}
      <div
        className="relative mt-12 h-[400px] sm:h-[480px] lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:h-auto lg:w-1/2"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div className="absolute inset-0 overflow-hidden bg-forest-950 clip-slant-top lg:[clip-path:none]">
          <AnimatePresence initial={false}>
            <motion.div
              key={current.id}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.12 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.img
                src={current.image}
                alt={current.alt}
                style={{ x: imgX, y: imgY, scale: 1.1, objectPosition: current.pos }}
                className="h-full w-full object-cover"
                fetchPriority="high"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950/80 via-forest-950/10 to-transparent" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-transparent to-forest-950/30" aria-hidden="true" />
        </div>

        {/* Depth: floating geometric shapes */}
        <motion.div style={{ x: geoX, y: geoY }} className="pointer-events-none absolute inset-0 z-[15]" aria-hidden="true">
          <div className="absolute right-[10%] top-[8%] h-24 w-24 rotate-12 rounded-2xl border-2 border-electric/60 animate-float" />
          <div className="absolute right-[26%] top-[22%] h-10 w-10 rotate-45 rounded-lg bg-electric/80 shadow-[0_0_40px_rgba(163,230,53,0.7)] animate-float-slow" />
          <div className="absolute bottom-[34%] right-[6%] h-16 w-16 -rotate-12 rounded-xl border border-white/30 bg-white/5 backdrop-blur-sm animate-float-slow" />
          <div className="absolute left-[24%] top-[12%] hidden h-48 w-48 animate-spin-slow rounded-[2.5rem] border border-dashed border-electric/30 lg:block" />
        </motion.div>

        {/* Glass cards */}
        <motion.div
          style={{ x: cardX, y: cardY }}
          className="glass-dark absolute right-3 top-6 z-30 w-52 rounded-2xl p-3.5 sm:right-6 sm:top-10 sm:w-56 lg:right-8 lg:top-24"
        >
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-electric">
            <Timer className="h-4 w-4" aria-hidden="true" /> Build time
          </p>
          <p className="mt-1 text-3xl font-extrabold leading-none text-white">
            60<span className="text-lg font-bold text-white/80"> sec</span>
          </p>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/20">
            <motion.div
              className="h-full rounded-full bg-electric"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
            />
          </div>
          <p className="mt-2 text-[11px] text-white/75">Your stage in 60 seconds · no tools</p>
        </motion.div>

        <motion.div
          style={{ x: cardX, y: cardY }}
          className="glass-dark absolute right-3 top-[9.5rem] z-30 hidden w-52 rounded-2xl p-3.5 sm:right-6 sm:block sm:w-56 lg:right-24 lg:top-[17rem]"
        >
          <div className="flex items-center gap-2">
            <Stars rating={5} size="h-3.5 w-3.5" />
            <span className="text-sm font-extrabold text-white">5.00 / 5</span>
          </div>
          <p className="mt-1 text-xs font-medium text-white/80">Top-rated platforms — schools, choirs &amp; venues</p>
          <button
            type="button"
            onClick={openFunding}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-electric px-2.5 py-1 text-[11px] font-extrabold text-forest-900 transition hover:bg-lime-300"
          >
            <Ticket className="h-3.5 w-3.5" aria-hidden="true" /> ECAL funding — up to 20% off
          </button>
        </motion.div>

        {/* Slide selector */}
        <div className="glass-dark absolute bottom-6 left-4 right-4 z-30 flex items-center gap-3 rounded-2xl p-3 sm:left-6 sm:right-auto sm:w-[380px] lg:bottom-44 lg:left-[18%] lg:right-auto lg:w-[380px]">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-electric">Now showing</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={current.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
                <p className="truncate text-sm font-extrabold text-white sm:text-base">{current.title}</p>
                <p className="text-xs font-medium text-white/75">{current.price}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-2 flex items-center gap-1.5" role="group" aria-label="Choose product showcase">
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSlide(i)}
                  aria-label={`Show ${s.label}`}
                  aria-current={i === slide}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === slide ? "w-8 bg-electric" : "w-2 bg-white/40 hover:bg-white/70",
                  )}
                />
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            aria-label={userPaused ? "Resume showcase autoplay" : "Pause showcase autoplay"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-electric transition hover:bg-white/20"
          >
            {userPaused ? <PlayCircle className="h-6 w-6" aria-hidden="true" /> : <PauseCircle className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </div>
    </section>
  );
}
