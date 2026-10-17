import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Lock, Minus, Plus, ShoppingBasket, Tag, Ticket, Trash2, Truck, X } from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";
import { ECAL_REFERENCE } from "@/data/content";
import { useStore } from "@/context/StoreContext";
import { formatGBP, formatGBP2 } from "@/utils/format";

export function CartDrawer() {
  const { cartOpen, closeCart, items, count, subtotal, discount, discountPct, funding, total, setQty, removeItem, applyFunding, openFunding } = useStore();
  const [code, setCode] = useState("");
  const [codeMsg, setCodeMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [checkoutMsg, setCheckoutMsg] = useState(false);

  const applyCode = (e: FormEvent) => {
    e.preventDefault();
    if (code.trim().toUpperCase() !== ECAL_REFERENCE) {
      setCodeMsg({ ok: false, text: "Enter your ECAL funding reference — tap “Get Code” in the top bar to unlock it." });
      return;
    }
    if (!funding) {
      setCodeMsg({ ok: false, text: "Choose your organisation type first — tap “Get Code” in the top bar." });
      return;
    }
    applyFunding(funding);
    setCodeMsg({ ok: true, text: `${ECAL_REFERENCE} funding applied — up to ${funding.pct}% off, confirmed on your official quotation.` });
    setCode("");
  };

  return (
    <Overlay
      open={cartOpen}
      onClose={closeCart}
      side="right"
      label="Shopping basket"
      hideClose
      className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
    >
      <div className="flex items-center justify-between border-b border-slate-100 bg-forest-900 px-5 py-4 text-white">
        <h2 className="flex items-center gap-2.5 text-lg font-extrabold">
          <ShoppingBasket className="h-5 w-5 text-electric" aria-hidden="true" />
          Your basket
          <span className="rounded-full bg-electric px-2 py-0.5 text-xs font-extrabold text-forest-900">{count}</span>
        </h2>
        <button
          type="button"
          onClick={closeCart}
          aria-label="Close basket"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <ShoppingBasket className="h-9 w-9" aria-hidden="true" />
          </span>
          <p className="mt-5 text-lg font-extrabold text-forest-900">Your basket is empty</p>
          <p className="mt-1 text-sm text-slate-600">Build a stage in 60 seconds or browse our ranges.</p>
          <a
            href="#quote-builder"
            onClick={closeCart}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-electric px-5 py-3 text-sm font-extrabold text-forest-900 transition hover:bg-lime-300"
          >
            Build your stage <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      ) : (
        <>
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
            <p className="flex items-center gap-2 text-xs font-bold text-forest-900">
              <Truck className="h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
              <span>Manufactured in Sheffield &amp; delivered direct to you across the UK · all prices inc VAT</span>
            </p>
            <button
              type="button"
              onClick={() => {
                closeCart();
                openFunding();
              }}
              className="mt-1 flex items-center gap-2 text-left text-xs font-semibold text-forest-700 underline decoration-electric decoration-2 underline-offset-2"
            >
              <Ticket className="h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
              <span>ECAL funding accepted — up to 20% off for Education, Charity, Arts &amp; Leisure organisations</span>
            </button>
          </div>

          <ul className="flex-1 divide-y divide-slate-100 overflow-y-auto px-5">
            <AnimatePresence initial={false}>
              {items.map((it) => (
                <motion.li
                  key={it.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-3.5 py-4">
                    <img src={it.image} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover ring-1 ring-slate-200" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold leading-snug text-forest-900">{it.name}</p>
                      {it.meta && <p className="mt-0.5 text-xs text-slate-600">{it.meta}</p>}
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-slate-200">
                          <button type="button" aria-label={`Decrease quantity of ${it.name}`} onClick={() => setQty(it.id, it.qty - 1)} className="flex h-8 w-8 items-center justify-center rounded-l-lg text-forest-900 transition hover:bg-slate-100">
                            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                          <span className="w-8 text-center text-sm font-extrabold tabular-nums" aria-live="polite">
                            {it.qty}
                          </span>
                          <button type="button" aria-label={`Increase quantity of ${it.name}`} onClick={() => setQty(it.id, it.qty + 1)} className="flex h-8 w-8 items-center justify-center rounded-r-lg text-forest-900 transition hover:bg-slate-100">
                            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                        <p className="text-sm font-extrabold tabular-nums text-forest-900">{formatGBP(it.price * it.qty)}</p>
                      </div>
                    </div>
                    <button type="button" aria-label={`Remove ${it.name}`} onClick={() => removeItem(it.id)} className="self-start rounded-lg p-1.5 text-slate-500 transition hover:bg-red-50 hover:text-red-700">
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <div className="border-t border-slate-200 bg-white px-5 pb-5 pt-4">
            <form onSubmit={applyCode} className="flex gap-2">
              <label htmlFor="promo" className="sr-only">
                ECAL funding reference
              </label>
              <div className="relative flex-1">
                <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                <input
                  id="promo"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="ECAL funding reference"
                  className="h-11 w-full rounded-xl border-2 border-slate-200 bg-white pl-9 pr-3 text-sm font-semibold uppercase text-forest-900 outline-none transition placeholder:normal-case placeholder:font-medium placeholder:text-slate-500 focus:border-forest-700 focus:shadow-[0_0_0_4px_rgba(163,230,53,0.35)]"
                />
              </div>
              <button type="submit" className="rounded-xl bg-forest-900 px-4 text-sm font-bold text-white transition hover:bg-forest-800">
                Apply
              </button>
            </form>
            {codeMsg && (
              <p role="status" className={`mt-2 text-xs font-semibold ${codeMsg.ok ? "text-forest-600" : "text-red-700"}`}>
                {codeMsg.text}
              </p>
            )}

            <dl className="mt-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <dt>Subtotal (inc. VAT)</dt>
                <dd className="font-semibold tabular-nums">{formatGBP2(subtotal)}</dd>
              </div>
              {funding && (
                <div className="flex justify-between font-semibold text-forest-600">
                  <dt className="flex items-center gap-1.5">
                    {ECAL_REFERENCE} funding (−{discountPct}%)
                    <button type="button" onClick={() => applyFunding(null)} aria-label="Remove ECAL funding" className="rounded p-0.5 text-slate-500 hover:text-red-700">
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </dt>
                  <dd className="tabular-nums">−{formatGBP2(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-200 pt-2.5 text-lg font-extrabold text-forest-900">
                <dt>Total (inc. VAT)</dt>
                <dd className="tabular-nums">{formatGBP2(total)}</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => setCheckoutMsg(true)}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-electric px-5 py-4 text-base font-extrabold text-forest-900 shadow-[0_10px_30px_-8px_rgba(132,204,22,0.9)] transition hover:bg-lime-300"
            >
              <Lock className="h-4 w-4" aria-hidden="true" /> Secure checkout
            </button>
            <p role="status" className="mt-2 min-h-4 text-center text-xs text-slate-600">
              {checkoutMsg ? "Design prototype — checkout connects to your live WooCommerce store." : "Totally magnetic · no locks to replace · up to 15-year lifespan"}
            </p>
          </div>
        </>
      )}
    </Overlay>
  );
}
