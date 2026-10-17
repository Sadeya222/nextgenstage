import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { BUSINESS, FOOTER_LINKS } from "@/data/content";
import { useStore } from "@/context/StoreContext";

function PaymentBadges() {
  const base = "flex h-8 items-center justify-center rounded-md bg-white px-2.5 text-[11px] font-extrabold shadow-sm";
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Accepted payment methods">
      <li className={`${base} italic tracking-wider text-blue-800`}>VISA</li>
      <li className={`${base} gap-0`} aria-label="Mastercard">
        <span className="h-4 w-4 rounded-full bg-red-500" />
        <span className="-ml-1.5 h-4 w-4 rounded-full bg-amber-400/90 mix-blend-multiply" />
      </li>
      <li className={`${base} text-sky-700`}>AMEX</li>
      <li className={`${base} italic text-blue-900`}>
        Pay<span className="text-sky-500">Pal</span>
      </li>
      <li className={`${base} text-slate-900`}> Pay</li>
      <li className={`${base} text-slate-800`}>
        <span className="text-blue-600">G</span>&nbsp;Pay
      </li>
      <li className={`${base} bg-pink-200 text-slate-900`}>Klarna.</li>
      <li className={`${base} text-forest-800`}>BACS</li>
    </ul>
  );
}

export function Footer() {
  const { openFunding } = useStore();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    if (/^\S+@\S+\.\S+$/.test(email.trim())) setState("done");
    else setState("error");
  };

  return (
    <footer id="contact" className="relative overflow-hidden bg-forest-950 text-white" itemScope itemType="https://schema.org/WPFooter">
      {/* CTA band */}
      <div className="relative overflow-hidden bg-gradient-to-r from-electric via-lime-300 to-electric-deep">
        <div className="absolute inset-0 bg-diagonal-lines opacity-60 mix-blend-multiply" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center">
          <div>
            <p className="text-2xl font-extrabold tracking-tight text-forest-900 sm:text-3xl">Need help choosing? Get a quick quote.</p>
            <p className="mt-1 text-sm font-semibold text-forest-900/80 sm:text-base">
              <button type="button" onClick={openFunding} className="underline decoration-forest-900/40 underline-offset-2 transition hover:text-forest-800">
                ECAL funding
              </button>{" "}
              saves Education, Charity, Arts &amp; Leisure organisations up to 20%.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openFunding}
              className="group on-light inline-flex items-center gap-2 rounded-xl bg-forest-900 px-6 py-3.5 text-sm font-extrabold text-electric transition hover:bg-forest-800"
            >
              Get a quotation <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
            <a href={`tel:${BUSINESS.phoneHref}`} className="on-light inline-flex items-center gap-2 rounded-xl border-2 border-forest-900 px-6 py-3.5 text-sm font-extrabold text-forest-900 transition hover:bg-forest-900/10">
              <Phone className="h-4 w-4" aria-hidden="true" /> {BUSINESS.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-grid-lime opacity-40" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12">
          {/* Brand + contact */}
          <div className="lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/75">
              {BUSINESS.altName} by {BUSINESS.name} — totally magnetic, lock-free portable staging, dancefloors, choir risers and ramps,
              handcrafted in Sheffield for schools, choirs and events across the UK.
            </p>
            <address className="mt-6 space-y-3 text-sm not-italic text-white/85" itemScope itemType="https://schema.org/LocalBusiness">
              <meta itemProp="name" content={BUSINESS.name} />
              <p className="flex items-start gap-3" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-electric" aria-hidden="true" />
                <span>
                  <span itemProp="streetAddress">{BUSINESS.street}</span>,<br />
                  <span itemProp="addressLocality">{BUSINESS.city}</span> <span itemProp="postalCode">{BUSINESS.postcode}</span>,{" "}
                  <span itemProp="addressCountry">{BUSINESS.country}</span>
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-electric" aria-hidden="true" />
                <a href={`tel:${BUSINESS.phoneHref}`} itemProp="telephone" className="font-semibold hover:text-electric">
                  {BUSINESS.phone}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-electric" aria-hidden="true" />
                <a href={`mailto:${BUSINESS.email}`} itemProp="email" className="font-semibold hover:text-electric">
                  {BUSINESS.email}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Clock className="h-4 w-4 shrink-0 text-electric" aria-hidden="true" />
                <span>Manufacturer to schools, choirs &amp; events</span>
              </p>
            </address>
          </div>

          {/* Link columns */}
          <nav id="links" aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-4">
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h2 className="text-xs font-extrabold uppercase tracking-[0.18em] text-electric">{title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        onClick={(e) => {
                          if (("action" in l && l.action === "funding") || l.href === "/quote-me/") {
                            e.preventDefault();
                            openFunding();
                          }
                        }}
                        className="text-sm font-medium text-white/80 transition hover:text-electric hover:underline hover:underline-offset-4"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h2 className="text-xs font-extrabold uppercase tracking-[0.18em] text-electric">Stay in the loop</h2>
            <p className="mt-4 text-lg font-extrabold leading-snug">Staging tips, funding deadlines &amp; new-product news.</p>
            {state === "done" ? (
              <p role="status" className="mt-4 flex items-start gap-3 rounded-2xl bg-electric/15 p-4 text-sm font-semibold text-electric ring-1 ring-electric/30">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                You’re on the list! Check your inbox for a welcome email.
              </p>
            ) : (
              <form onSubmit={subscribe} noValidate className="mt-4">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <div className="flex gap-2 rounded-2xl bg-white/10 p-1.5 ring-1 ring-white/15 focus-within:ring-2 focus-within:ring-electric">
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (state === "error") setState("idle");
                    }}
                    autoComplete="email"
                    placeholder="you@organisation.org"
                    aria-invalid={state === "error"}
                    aria-describedby={state === "error" ? "newsletter-error" : undefined}
                    className="min-w-0 flex-1 bg-transparent px-3 text-sm font-medium text-white outline-none placeholder:text-white/60 focus-visible:outline-none"
                  />
                  <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-electric px-4 py-3 text-sm font-extrabold text-forest-900 transition hover:bg-lime-300">
                    Subscribe <Send className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                {state === "error" && (
                  <p id="newsletter-error" role="alert" className="mt-2 text-xs font-semibold text-red-300">
                    Please enter a valid email address.
                  </p>
                )}
                <p className="mt-3 text-xs text-white/60">One email a month. Unsubscribe any time.</p>
              </form>
            )}

            <div className="mt-8">
              <h2 className="text-xs font-extrabold uppercase tracking-[0.18em] text-electric">We accept</h2>
              <div className="mt-3">
                <PaymentBadges />
              </div>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-white/65 sm:px-6 md:flex-row">
            <p>
              © {new Date().getFullYear()} {BUSINESS.name} · {BUSINESS.altName}. Registered in England &amp; Wales. All rights reserved.
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-semibold">
              {["Privacy Policy", "Terms & Conditions", "Cookie Policy", "Accessibility", "Sitemap"].map((l) => (
                <li key={l}>
                  <a href="#top" className="transition hover:text-electric">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
