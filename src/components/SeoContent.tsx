import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, HeartHandshake, Leaf, Magnet, Phone } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BUSINESS, IMAGES } from "@/data/content";
import { useStore } from "@/context/StoreContext";

const ARTICLES = [
  {
    icon: Magnet,
    title: "Totally magnetic — no locks, no keys, nothing to replace",
    body: (
      <>
        NexGen platforms are <strong>totally magnetic</strong> — no locks and no keys required, which means less hassle and more security.
        Other branded platforms such as Revostage, Intellistage, Alustage and Go-Pak can have up to 8 locks that need replacing over time.
        With NexGen there is nothing to replace, so platforms stay 100% functional for their whole lifespan.
      </>
    ),
  },
  {
    icon: BadgeCheck,
    title: "Over twenty years of UK stage manufacturing experience",
    body: (
      <>
        We manufacture our products <strong>in the UK</strong> — handcrafted in Sheffield — and deliver them directly to you, so you get the
        best quality at the best price. With over twenty years of stage manufacturing experience, NexGen is a trusted UK manufacturer of
        portable staging and dancefloors.
      </>
    ),
  },
  {
    icon: Leaf,
    title: "Eco-friendly, sustainable materials",
    body: (
      <>
        The Platinum range uses <strong>recycled core material, sustainably sourced plywood, recycled carpet and less hazardous
        adhesives</strong> — which means less waste and more responsibility, with a smaller carbon footprint than aluminium-based systems.
      </>
    ),
  },
  {
    icon: HeartHandshake,
    title: "ECAL funding — up to 20% off for eligible organisations",
    body: (
      <>
        The <strong>Education, Charity, Arts &amp; Leisure (ECAL) Funding</strong> programme offers eligible organisations discounts of up to
        20% on staging equipment — with no complex application forms, guaranteed funding for eligible organisations, and savings that apply
        to complete staging systems and accessories.
      </>
    ),
  },
];

const VENUES = ["Schools", "Choirs", "Churches", "Theatres", "Community groups", "Events & festivals", "Dance schools", "Award ceremonies"];

export function SeoContent() {
  const { openFunding } = useStore();
  return (
    <section id="why-nexgen" aria-labelledby="why-heading" className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div className="absolute inset-0 bg-grid-slate opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-14">
        {/* Left: heading + visual */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-40">
            <SectionHeading
              eyebrow="Why NexGen"
              id="why-heading"
              title={
                <>
                  UK manufactured <span className="text-forest-600">portable staging</span>, handcrafted in Sheffield
                </>
              }
              description="NexGen Portable Staging & Dancefloors — fast, eco-friendly, UK-made magnetic portable staging. Lighter, faster, safer and longer lasting than traditional lock-based systems."
            />

            <motion.figure
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="relative mt-8 overflow-hidden rounded-3xl shadow-2xl shadow-forest-950/20"
            >
              <img src={IMAGES.stagingLondon} alt="NexGen portable staging set up at an event in London" loading="lazy" className="aspect-[4/3] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/20 to-transparent" aria-hidden="true" />
              <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-5 text-white">
                <span>
                  <span className="block text-xs font-bold uppercase tracking-widest text-electric">NexGen in situ</span>
                  <span className="block text-lg font-extrabold">Staging in use across the UK</span>
                </span>
                <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold">
                  <Phone className="h-4 w-4 text-electric" aria-hidden="true" /> {BUSINESS.phone}
                </span>
              </figcaption>
            </motion.figure>
          </div>
        </div>

        {/* Right: semantic articles */}
        <div className="lg:col-span-7">
          <div className="grid gap-5 sm:grid-cols-2">
            {ARTICLES.map((a, i) => (
              <motion.article
                key={a.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-electric hover:bg-white hover:shadow-[0_0_0_1px_#a3e635,0_22px_48px_-18px_rgba(132,204,22,0.5)]"
              >
                <span className="absolute -right-3 -top-4 select-none text-[88px] font-extrabold leading-none text-slate-200/70 transition group-hover:text-electric/30" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-900 text-electric transition group-hover:rotate-[-6deg] group-hover:scale-110">
                  <a.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="relative mt-4 text-lg font-extrabold leading-snug text-forest-900">{a.title}</h3>
                <p className="relative mt-2 text-[15px] leading-relaxed text-slate-600 [&_strong]:font-bold [&_strong]:text-forest-800">{a.body}</p>
              </motion.article>
            ))}
          </div>

          <motion.article
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="relative mt-5 overflow-hidden rounded-3xl bg-forest-900 p-7 text-white sm:p-8"
          >
            <div className="absolute inset-0 bg-grid-lime opacity-70" aria-hidden="true" />
            <div className="absolute -right-10 -top-10 h-40 w-40 rotate-12 rounded-3xl bg-electric/20 blur-2xl" aria-hidden="true" />
            <div className="relative">
              <h3 className="text-xl font-extrabold">Build your own perfect-sized portable stage or dancefloor</h3>
              <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-white/80">
                Using our deck platforms and riser legs, you can build your own perfect-sized portable stage or dancefloor. Storage trolleys,
                handrails, ramps, backdrops and a full range of parts are in stock in Sheffield too.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {VENUES.map((v) => (
                  <li key={v} className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white ring-1 ring-white/15">
                    {v}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/shop/" className="group inline-flex items-center gap-2 rounded-xl bg-electric px-5 py-3 text-sm font-extrabold text-forest-900 transition hover:bg-lime-300">
                  Browse the shop <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </a>
                <button type="button" onClick={openFunding} className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:border-electric hover:bg-white/10">
                  Check ECAL funding
                </button>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
