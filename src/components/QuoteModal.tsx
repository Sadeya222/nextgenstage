import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, FileText, Send, ShieldCheck } from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";
import { FUNDING_TIERS } from "@/data/content";
import { useStore, type QuoteSummary } from "@/context/StoreContext";
import { formatGBP } from "@/utils/format";

function QuoteForm({ quote, onClose }: { quote: QuoteSummary; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [ref] = useState(() => `NG-${Math.floor(10000 + Math.random() * 89999)}`);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const next: typeof errors = {};
    if (!name) next.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Please enter a valid email address";
    setErrors(next);
    if (!Object.keys(next).length) setSent(true);
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="px-6 py-12 text-center sm:px-10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-electric text-forest-900 shadow-[0_0_0_8px_rgba(163,230,53,0.25)]">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-forest-900">Your official quote is on its way</h2>
        <p className="mx-auto mt-2 max-w-sm text-slate-600">
          Our Sheffield team will email your itemised quote within one working hour. Reference{" "}
          <strong className="font-mono text-forest-900">{ref}</strong>.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-forest-900 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-forest-800"
        >
          Back to the site
        </button>
      </motion.div>
    );
  }

  const field =
    "mt-1.5 w-full rounded-xl border-2 border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-forest-900 outline-none transition placeholder:text-slate-500 focus:border-forest-700 focus:shadow-[0_0_0_4px_rgba(163,230,53,0.35)]";

  return (
    <>
      <div className="relative overflow-hidden bg-forest-900 px-6 pb-5 pt-7 text-white sm:px-8">
        <div className="absolute inset-0 bg-grid-lime" aria-hidden="true" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-electric px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-forest-900">
            <FileText className="h-3.5 w-3.5" aria-hidden="true" /> Official stage quote
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight">Send me my official quote</h2>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5 rounded-2xl bg-white/[0.07] p-4 text-sm ring-1 ring-white/10">
            <dt className="text-white/70">Stage</dt>
            <dd className="text-right font-bold">{quote.dims}</dd>
            {quote.configuration && (
              <>
                <dt className="text-white/70">Configuration</dt>
                <dd className="text-right font-bold">{quote.configuration}</dd>
              </>
            )}
            <dt className="text-white/70">Decks</dt>
            <dd className="text-right font-bold">
              {quote.decks} × {quote.deckType}
            </dd>
            {quote.heightDetail && (
              <>
                <dt className="text-white/70">Stage heights</dt>
                <dd className="text-right font-bold">{quote.heightDetail}</dd>
              </>
            )}
            {quote.extras.length > 0 && (
              <>
                <dt className="text-white/70">Extras</dt>
                <dd className="text-right font-bold">{quote.extras.join(", ")}</dd>
              </>
            )}
            {quote.discountPct > 0 && (
              <>
                <dt className="text-white/70">Funding ({quote.code})</dt>
                <dd className="text-right font-bold text-electric">−{quote.discountPct}%</dd>
              </>
            )}
            {quote.priceBasis && (
              <>
                <dt className="text-white/70">Estimate based on</dt>
                <dd className="text-right font-bold">{quote.priceBasis}</dd>
              </>
            )}
            <dt className="border-t border-white/15 pt-2 text-white/70">Estimate ex. VAT</dt>
            <dd className="border-t border-white/15 pt-2 text-right text-xl font-extrabold text-electric">{formatGBP(quote.total)}</dd>
            {quote.totalIncVat != null && (
              <>
                <dt className="text-white/70">Estimate inc. VAT</dt>
                <dd className="text-right font-bold">{formatGBP(quote.totalIncVat)}</dd>
              </>
            )}
          </dl>
        </div>
      </div>

      <form onSubmit={submit} noValidate className="space-y-4 px-6 pb-7 pt-5 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="q-name" className="text-sm font-bold text-forest-900">
              Full name
            </label>
            <input id="q-name" name="name" autoComplete="name" data-autofocus className={field} placeholder="Jane Smith" aria-invalid={!!errors.name} aria-describedby={errors.name ? "q-name-err" : undefined} />
            {errors.name && (
              <p id="q-name-err" role="alert" className="mt-1 text-xs font-semibold text-red-700">
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="q-email" className="text-sm font-bold text-forest-900">
              Email
            </label>
            <input id="q-email" name="email" type="email" autoComplete="email" className={field} placeholder="you@school.sch.uk" aria-invalid={!!errors.email} aria-describedby={errors.email ? "q-email-err" : undefined} />
            {errors.email && (
              <p id="q-email-err" role="alert" className="mt-1 text-xs font-semibold text-red-700">
                {errors.email}
              </p>
            )}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="q-org" className="text-sm font-bold text-forest-900">
              Organisation type (ECAL funding)
            </label>
            <select id="q-org" name="org" defaultValue="" className={field}>
              <option value="" disabled>
                Select…
              </option>
              {FUNDING_TIERS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label} (funding eligible)
                </option>
              ))}
              <option value="business">Business / Private</option>
            </select>
          </div>
          <div>
            <label htmlFor="q-phone" className="text-sm font-bold text-forest-900">
              Phone <span className="font-medium text-slate-500">(optional)</span>
            </label>
            <input id="q-phone" name="phone" type="tel" autoComplete="tel" className={field} placeholder="07…" />
          </div>
        </div>
        <button
          type="submit"
          className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-electric px-5 py-3.5 text-sm font-extrabold text-forest-900 shadow-[0_8px_30px_-8px_rgba(132,204,22,0.9)] transition hover:bg-lime-300"
        >
          <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          Email me my official quote
        </button>
        <p className="flex items-center gap-2 text-xs text-slate-600">
          <ShieldCheck className="h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
          Free UK quotation — no obligation. Select “ECAL Funding” options above for up to 20% off.
        </p>
      </form>
    </>
  );
}

export function QuoteModal() {
  const { quote, closeQuote } = useStore();
  return (
    <Overlay
      open={!!quote}
      onClose={closeQuote}
      label="Request official stage quote"
      closeTone="light"
      className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
    >
      {quote && <QuoteForm quote={quote} onClose={closeQuote} />}
    </Overlay>
  );
}
