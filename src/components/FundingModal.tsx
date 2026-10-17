import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Send, ShieldCheck, Ticket } from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";
import { BUSINESS, FUNDING_TIERS } from "@/data/content";
import { useStore } from "@/context/StoreContext";

interface LeadMeta {
  userAgent: string;
  language: string;
  platform: string;
  screen: string;
  viewport: string;
  timezone: string;
  referrer: string;
  pageUrl: string;
  timestamp: string;
}

function collectMeta(): LeadMeta {
  const nav = typeof navigator !== "undefined" ? navigator : ({} as Navigator);
  const scr = typeof screen !== "undefined" ? screen : ({ width: 0, height: 0 } as Screen);
  return {
    userAgent: nav.userAgent ?? "",
    language: nav.language ?? "",
    platform: nav.platform ?? "",
    screen: `${scr.width}×${scr.height}`,
    viewport: typeof window !== "undefined" ? `${window.innerWidth}×${window.innerHeight}` : "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "",
    referrer: typeof document !== "undefined" ? document.referrer : "",
    pageUrl: typeof window !== "undefined" ? window.location.href : "",
    timestamp: new Date().toISOString(),
  };
}

export function FundingModal() {
  const { fundingOpen, closeFunding, applyFunding } = useStore();
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; org?: string }>({});
  const [ref] = useState(() => `ECAL-${Math.floor(10000 + Math.random() * 89999)}`);

  useEffect(() => {
    if (fundingOpen) {
      setSent(false);
      setErrors({});
    }
  }, [fundingOpen]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const orgType = String(data.get("orgType") || "").trim();
    const next: typeof errors = {};
    if (!name) next.name = "Please enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Please enter a valid email address";
    if (!orgType) next.org = "Please select an organisation type";
    setErrors(next);
    if (Object.keys(next).length) return;

    const payload = {
      fullName: name,
      email,
      phone: String(data.get("phone") || "").trim(),
      organisationName: String(data.get("orgName") || "").trim(),
      organisationType: orgType,
      stageNotes: String(data.get("notes") || "").trim(),
      source: "ECAL lead modal",
      meta: collectMeta(),
    };
    console.info("[ECAL lead]", payload);

    const tier = FUNDING_TIERS.find((t) => t.id === orgType) ?? null;
    applyFunding(tier);
    setSent(true);
  };

  const field =
    "mt-1.5 w-full rounded-xl border-2 border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-forest-900 outline-none transition placeholder:text-slate-500 focus:border-forest-700 focus:shadow-[0_0_0_4px_rgba(163,230,53,0.35)]";

  return (
    <Overlay
      open={fundingOpen}
      onClose={closeFunding}
      label="Get ECAL Discounted Pricing & Quote"
      className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl ring-1 ring-black/5"
    >
      {sent ? (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="px-6 py-12 text-center sm:px-10">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-electric text-forest-900 shadow-[0_0_0_8px_rgba(163,230,53,0.25)]">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-forest-900">Your ECAL request is on its way</h2>
          <p className="mx-auto mt-2 max-w-sm text-slate-600">
            Our Sheffield team will email your discounted quote within one working hour. Reference{" "}
            <strong className="font-mono text-forest-900">{ref}</strong>.
          </p>
          <button
            type="button"
            onClick={closeFunding}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-forest-900 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-forest-800"
          >
            Back to the site
          </button>
        </motion.div>
      ) : (
        <>
          <div className="relative overflow-hidden bg-forest-900 px-6 pb-6 pt-8 text-white sm:px-8">
            <div className="absolute inset-0 bg-grid-lime opacity-70" aria-hidden="true" />
            <div className="absolute -right-10 -top-16 h-52 w-52 rotate-12 rounded-3xl bg-electric/20 blur-2xl" aria-hidden="true" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-electric px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-forest-900">
                <Ticket className="h-3.5 w-3.5" aria-hidden="true" /> ECAL Funding · up to 20% off
              </span>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">Get ECAL Discounted Pricing &amp; Quote</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Education, Charity, Arts and Leisure organisations can save up to 20% on NexGen portable staging. Tell us about your venue and we’ll send an official quote.
              </p>
            </div>
          </div>

          <form onSubmit={submit} noValidate className="space-y-4 px-6 pb-7 pt-5 sm:px-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="ecal-name" className="text-sm font-bold text-forest-900">
                  Full Name
                </label>
                <input
                  id="ecal-name"
                  name="name"
                  autoComplete="name"
                  data-autofocus
                  className={field}
                  placeholder="Jane Smith"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "ecal-name-err" : undefined}
                />
                {errors.name && (
                  <p id="ecal-name-err" role="alert" className="mt-1 text-xs font-semibold text-red-700">
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="ecal-email" className="text-sm font-bold text-forest-900">
                  Email Address
                </label>
                <input
                  id="ecal-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={field}
                  placeholder="you@school.sch.uk"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "ecal-email-err" : undefined}
                />
                {errors.email && (
                  <p id="ecal-email-err" role="alert" className="mt-1 text-xs font-semibold text-red-700">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="ecal-phone" className="text-sm font-bold text-forest-900">
                  Phone
                </label>
                <input id="ecal-phone" name="phone" type="tel" autoComplete="tel" className={field} placeholder="0114 399 2978" />
              </div>
              <div>
                <label htmlFor="ecal-org-name" className="text-sm font-bold text-forest-900">
                  Organisation Name
                </label>
                <input id="ecal-org-name" name="orgName" autoComplete="organization" className={field} placeholder="Hillcrest Academy" />
              </div>
            </div>

            <div>
              <label htmlFor="ecal-org-type" className="text-sm font-bold text-forest-900">
                Organisation Type
              </label>
              <select id="ecal-org-type" name="orgType" defaultValue="" className={field} aria-invalid={!!errors.org} aria-describedby={errors.org ? "ecal-org-err" : undefined}>
                <option value="" disabled>
                  Select Education, Charity, Arts or Leisure…
                </option>
                {FUNDING_TIERS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
              {errors.org && (
                <p id="ecal-org-err" role="alert" className="mt-1 text-xs font-semibold text-red-700">
                  {errors.org}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="ecal-notes" className="text-sm font-bold text-forest-900">
                Stage Notes
              </label>
              <textarea
                id="ecal-notes"
                name="notes"
                rows={3}
                className={`${field} resize-y min-h-[88px]`}
                placeholder="Size, height, choir rows, delivery date…"
              />
            </div>

            <button
              type="submit"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-electric px-5 py-3.5 text-sm font-extrabold text-forest-900 shadow-[0_8px_30px_-8px_rgba(132,204,22,0.9)] transition hover:bg-lime-300"
            >
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              Request ECAL Discount Quote
            </button>
            <p className="flex items-center gap-2 text-xs text-slate-600">
              <ShieldCheck className="h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
              No obligation. Or call {BUSINESS.phone} for personalised advice.
            </p>
          </form>
        </>
      )}
    </Overlay>
  );
}
