import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clapperboard, ExternalLink, Play, Video } from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VIDEO_TABS, type VideoTab } from "@/data/content";
import { cn } from "@/utils/cn";

/** Modal player hosting the real YouTube embed (autoplays from the chapter start point). */
function VideoModal({ tab, onClose }: { tab: VideoTab | null; onClose: () => void }) {
  return (
    <Overlay
      open={!!tab}
      onClose={onClose}
      label={tab ? `Video: ${tab.title}` : "Video"}
      closeTone="light"
      className="w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10"
    >
      {tab && (
        <div>
          <div className="relative aspect-video bg-black">
            <iframe
              key={tab.yt}
              src={`https://www.youtube.com/embed/${tab.yt}?autoplay=1&start=${tab.start}&rel=0`}
              title={tab.title}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <div className="flex items-center justify-between gap-4 bg-forest-950 px-4 py-3 text-white sm:px-6">
            <p className="min-w-0 truncate text-sm font-bold">
              <span className="text-electric">▶</span> {tab.title}
            </p>
            <a
              href={`https://www.youtube.com/watch?v=${tab.yt}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold transition hover:bg-white/20"
            >
              <Video className="h-4 w-4 text-electric" aria-hidden="true" /> Watch on YouTube
            </a>
          </div>
        </div>
      )}
    </Overlay>
  );
}

export function VideoShowcase() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState<VideoTab | null>(null);
  const tab = VIDEO_TABS[active];
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent, i: number) => {
    let n = i;
    if (e.key === "ArrowRight") n = (i + 1) % VIDEO_TABS.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + VIDEO_TABS.length) % VIDEO_TABS.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = VIDEO_TABS.length - 1;
    else return;
    e.preventDefault();
    setActive(n);
    tabRefs.current[n]?.focus();
  };

  return (
    <section id="video-showcase" aria-labelledby="video-heading" className="relative isolate overflow-hidden bg-forest-950 py-24 text-white sm:py-32">
      <div className="absolute inset-0 -z-10 bg-grid-lime opacity-60" aria-hidden="true" />
      <div className="absolute -left-40 top-20 -z-10 h-[500px] w-[500px] rounded-full bg-electric/10 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-32 bottom-0 -z-10 h-[420px] w-[420px] rotate-12 rounded-[3rem] bg-forest-600/20 blur-3xl" aria-hidden="true" />
      {/* Slanted top edge */}
      <div className="absolute inset-x-0 top-0 -z-10 h-12 bg-slate-50 [clip-path:polygon(0_0,100%_0,100%_0,0_100%)] sm:h-20" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          tone="dark"
          eyebrow="Video guide"
          id="video-heading"
          title={
            <>
              Built for SPEED! <span className="text-gradient-lime">Your stage in 60 seconds.</span>
            </>
          }
          description="Watch our staging video gallery to see how fast, and easy it is to assemble NexGen staging."
        />

        <div role="tablist" aria-label="Video categories" className="mt-10 inline-flex max-w-full flex-wrap gap-2 rounded-2xl bg-white/[0.06] p-1.5 ring-1 ring-white/10">
          {VIDEO_TABS.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`vtab-${t.id}`}
              aria-selected={active === i}
              aria-controls={`vpanel-${t.id}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn(
                "relative rounded-xl px-4 py-2.5 text-sm font-bold transition sm:px-5",
                active === i ? "text-forest-900" : "text-white/80 hover:text-white",
              )}
            >
              {active === i && (
                <motion.span layoutId="video-tab-pill" className="absolute inset-0 rounded-xl bg-electric shadow-[0_8px_24px_-6px_rgba(163,230,53,0.7)]" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
              )}
              <span className="relative">
                <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden">{t.short}</span>
              </span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab.id}
            role="tabpanel"
            id={`vpanel-${tab.id}`}
            aria-labelledby={`vtab-${tab.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="mt-8 grid gap-6 lg:grid-cols-12"
          >
            <button
              type="button"
              onClick={() => setPlaying(tab)}
              aria-label={`Play video: ${tab.title}`}
              className="group relative isolate aspect-video overflow-hidden rounded-3xl text-left shadow-2xl shadow-black/40 ring-1 ring-white/15 transition duration-500 hover:ring-2 hover:ring-electric lg:col-span-8"
            >
              <img src={tab.image} alt="" loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-950/90 via-forest-950/20 to-forest-950/40" aria-hidden="true" />
              <div className="absolute left-4 top-4 flex items-center gap-2 sm:left-6 sm:top-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-xs font-bold backdrop-blur">
                  <Clapperboard className="h-3.5 w-3.5 text-electric" aria-hidden="true" /> NexGen video guide
                </span>
              </div>
              <span className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center" aria-hidden="true">
                <span className="absolute inset-0 animate-ping rounded-full bg-electric/40" />
                <span className="absolute inset-0 rounded-full bg-electric/25 blur-xl" />
                <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-electric text-forest-900 shadow-[0_0_50px_rgba(163,230,53,0.65)] transition duration-300 group-hover:scale-110">
                  <Play className="ml-1 h-9 w-9" fill="currentColor" />
                </span>
              </span>
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-6">
                <span className="max-w-md text-lg font-extrabold leading-snug sm:text-2xl">{tab.title}</span>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-bold backdrop-blur">
                  <Video className="h-3.5 w-3.5 text-electric" aria-hidden="true" /> YouTube
                </span>
              </span>
            </button>

            <article className="flex flex-col rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10 backdrop-blur lg:col-span-4">
              <h3 className="text-xl font-extrabold leading-snug">{tab.short}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">{tab.description}</p>
              <ul className="mt-5 space-y-3">
                {tab.facts.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-electric text-xs font-extrabold text-forest-900">
                      <Play className="h-3 w-3" fill="currentColor" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold leading-snug text-white/90">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-2.5 sm:mt-6">
                <button
                  type="button"
                  onClick={() => setPlaying(tab)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-electric px-5 py-3.5 text-sm font-extrabold text-forest-900 transition hover:bg-lime-300"
                >
                  <Play className="h-4 w-4" fill="currentColor" aria-hidden="true" /> Watch now
                </button>
                <a
                  href={`https://www.youtube.com/watch?v=${tab.yt}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:border-electric hover:bg-white/10"
                >
                  <ExternalLink className="h-4 w-4 text-electric" aria-hidden="true" /> Watch on YouTube
                </a>
              </div>
            </article>
          </motion.div>
        </AnimatePresence>
      </div>

      <VideoModal tab={playing} onClose={() => setPlaying(null)} />
    </section>
  );
}
