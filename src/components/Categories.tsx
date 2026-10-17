import { motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CATEGORIES, PRODUCTS } from "@/data/content";
import { useStore } from "@/context/StoreContext";
import { formatGBP } from "@/utils/format";

export function Categories() {
  const { addItem } = useStore();

  return (
    <section id="shop" aria-labelledby="categories-heading" className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28">
      <div className="absolute inset-0 bg-grid-slate [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Shop the range"
            id="categories-heading"
            title={
              <>
                Staging built for <span className="relative whitespace-nowrap text-forest-600">every stage<span className="absolute -bottom-1 left-0 h-1.5 w-full rounded-full bg-electric" aria-hidden="true" /></span>
              </>
            }
            description="From a single 1×1m deck to a full choir riser system — every NexGen product is made in Sheffield, tool-free to assemble and backed for 10 years."
          />
          <a
            href="#quote-builder"
            className="group inline-flex items-center gap-2 rounded-xl border-2 border-forest-900 px-5 py-3 text-sm font-extrabold text-forest-900 transition hover:bg-forest-900 hover:text-electric"
          >
            Not sure? Build a quote
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12">
          {CATEGORIES.map((c, i) => {
            const product = PRODUCTS.find((p) => p.id === c.quickAdd)!;
            return (
              <motion.article
                key={c.id}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: (i % 2) * 0.1 }}
                className={`group relative isolate h-[360px] overflow-hidden rounded-3xl bg-forest-900 shadow-lg shadow-forest-950/10 ring-1 ring-forest-900/10 transition duration-500 hover:shadow-[0_0_0_2px_#a3e635,0_28px_70px_-18px_rgba(132,204,22,0.6)] sm:h-[400px] ${c.span}`}
              >
                <img
                  src={c.image}
                  alt={`${c.title} – NexGen portable staging`}
                  loading="lazy"
                  className="absolute inset-0 -z-10 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110 group-hover:rotate-[0.6deg]"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-950 via-forest-950/55 to-forest-950/5 transition-opacity duration-500 group-hover:from-forest-950/95" aria-hidden="true" />
                <div className="absolute inset-0 -z-10 translate-x-[-110%] bg-gradient-to-r from-transparent via-electric/15 to-transparent transition duration-1000 group-hover:translate-x-[110%]" aria-hidden="true" />

                <div className="flex h-full flex-col justify-between p-5 sm:p-7">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 min-w-9 items-center justify-center rounded-xl bg-electric px-2 text-sm font-extrabold text-forest-900">
                        0{i + 1}
                      </span>
                      {c.badge && (
                        <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
                          {c.badge}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image, meta: product.blurb })}
                      aria-label={`Quick add ${product.name} to basket`}
                      className="relative z-10 inline-flex h-10 items-center gap-1.5 rounded-full bg-white/15 pl-3 pr-3.5 text-xs font-bold text-white backdrop-blur transition hover:bg-electric hover:text-forest-900 focus-visible:bg-electric focus-visible:text-forest-900 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-visible:translate-y-0 md:focus-visible:opacity-100"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" /> Quick add
                    </button>
                  </div>

                  <div>
                    <h3 className="max-w-md text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-[28px]">
                      <a href="#shop" className="after:absolute after:inset-0 after:content-['']">
                        {c.title}
                      </a>
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80 sm:text-[15px]">{c.desc}</p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white/80">
                        {c.count} products · from <span className="text-lg font-extrabold text-electric">{formatGBP(c.from)}</span>
                      </p>
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-electric text-forest-900 transition duration-300 group-hover:rotate-45 group-hover:scale-110" aria-hidden="true">
                        <ArrowUpRight className="h-5 w-5" />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
