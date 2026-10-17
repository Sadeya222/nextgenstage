import { useId, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, HelpCircle, Mail, Phone } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BUSINESS, FAQS } from "@/data/content";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/utils/cn";

function FaqAnswer({ text }: { text: string }) {
  const { openFunding } = useStore();
  const parts = text.split(/(ECAL Funding|ECAL funding|portablestage\.co\.uk\/quote-me)/g);
  return (
    <>
      {parts.map((part, i) => {
        const isTrigger = /^(ECAL Funding|ECAL funding|portablestage\.co\.uk\/quote-me)$/.test(part);
        if (!isTrigger) return <span key={i}>{part}</span>;
        return (
          <button
            key={i}
            type="button"
            onClick={openFunding}
            className="font-extrabold text-forest-800 underline decoration-electric decoration-2 underline-offset-2 transition hover:text-forest-600"
          >
            {part}
          </button>
        );
      })}
    </>
  );
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export function FaqSection() {
  const uid = useId();
  const [open, setOpen] = useState<Set<number>>(new Set([0]));
  const allOpen = open.size === FAQS.length;

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section id="faq" aria-labelledby="faq-heading" className="relative overflow-hidden bg-slate-100 py-20 sm:py-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="absolute -left-24 top-10 h-72 w-72 rotate-12 rounded-[3rem] bg-electric/20 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-40">
            <SectionHeading
              eyebrow="Questions answered"
              id="faq-heading"
              title="Portable staging FAQs"
              description="Everything schools, churches and venues ask before buying a NexGen portable stage."
            />
            <div className="mt-8 rounded-3xl bg-forest-900 p-6 text-white shadow-xl shadow-forest-950/20">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-electric text-forest-900">
                <HelpCircle className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-extrabold">Still have a question?</h3>
              <p className="mt-1 text-sm text-white/75">Our Sheffield team is here to help with your staging requirements.</p>
              <div className="mt-4 space-y-2">
                <a href={`tel:${BUSINESS.phoneHref}`} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-bold transition hover:bg-white/15">
                  <Phone className="h-4 w-4 text-electric" aria-hidden="true" /> {BUSINESS.phone}
                </a>
                <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-bold transition hover:bg-white/15">
                  <Mail className="h-4 w-4 text-electric" aria-hidden="true" /> {BUSINESS.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(allOpen ? new Set() : new Set(FAQS.map((_, i) => i)))}
              className="rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-forest-800 ring-1 ring-forest-800/30 transition hover:bg-forest-900 hover:text-electric"
            >
              {allOpen ? "Collapse all" : "Expand all"}
            </button>
          </div>

          <div className="space-y-3">
            {FAQS.map((f, i) => {
              const isOpen = open.has(i);
              const btnId = `${uid}-q-${i}`;
              const panelId = `${uid}-a-${i}`;
              return (
                <motion.div
                  key={f.q}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: Math.min(i, 3) * 0.05 }}
                  className={cn(
                    "overflow-hidden rounded-2xl border-2 bg-white transition duration-300",
                    isOpen ? "border-forest-800 shadow-[0_0_0_4px_rgba(163,230,53,0.3)]" : "border-transparent shadow-sm hover:border-forest-300",
                  )}
                >
                  <h3>
                    <button
                      type="button"
                      id={btnId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(i)}
                      className="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                    >
                      <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold transition", isOpen ? "bg-electric text-forest-900" : "bg-forest-900 text-electric")}>
                        {i + 1}
                      </span>
                      <span className="flex-1 text-base font-extrabold leading-snug text-forest-900 sm:text-[17px]">{f.q}</span>
                      <ChevronDown className={cn("h-5 w-5 shrink-0 text-forest-700 transition-transform duration-300", isOpen && "rotate-180")} aria-hidden="true" />
                    </button>
                  </h3>
                  {/* Answer text stays in the DOM when collapsed so it remains indexable */}
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    inert={!isOpen}
                    className={cn("grid transition-[grid-template-rows] duration-300 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 pl-[4.25rem] pr-5 text-[15px] leading-relaxed text-slate-600 sm:pr-8">
                        <FaqAnswer text={f.a} />
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
