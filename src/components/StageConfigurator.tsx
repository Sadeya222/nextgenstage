import { useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  GraduationCap,
  Layers,
  Minus,
  Music2,
  Plus,
  Ruler,
  ShoppingBasket,
  Sparkles,
  Ticket,
  Users,
  X,
} from "lucide-react";
import { IsoStage } from "@/components/IsoStage";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { ECAL_REFERENCE, IMAGES, PRODUCTS } from "@/data/content";
import { useStore } from "@/context/StoreContext";
import { formatGBP, formatGBP2 } from "@/utils/format";
import { cn } from "@/utils/cn";

// Real pre-designed SteelCity packages from the shop (modules = w×d of 1×1m decks)
const PRESETS = [
  { id: "3x2", label: "3 × 2 m", w: 3, d: 2, tag: "6 modules · school favourite" },
  { id: "4x3", label: "4 × 3 m", w: 4, d: 3, tag: "12 modules · Popular" },
  { id: "6x3", label: "6 × 3 m", w: 6, d: 3, tag: "18 modules · full stage" },
  { id: "custom", label: "Custom", w: 0, d: 0, tag: "Your size" },
] as const;

// Real NexGen riser leg heights (mm) — every module is a deck & riser combo at any height
const HEIGHTS = [200, 300, 400, 600, 800, 1000];

const catalogPriceExVat = (id: string, fallback: number) => {
  const product = PRODUCTS.find((item) => item.id === id);
  return product ? product.price / 1.2 : fallback;
};

const STANDARD_CHOIR_PACKAGE = PRODUCTS.find((product) => product.id === "choir-3t");
const FLAT_PACKAGE_IDS: Record<string, string> = {
  "3x2": "pkg-3x2",
  "4x3": "pkg-4x3",
  "6x3": "pkg-6x3",
};

// Module (deck & riser) prices ex VAT, derived from live catalog inc-VAT prices where available.
const DECK_TYPES = [
  { id: "steelcity-1x1", label: "SteelCity 1×1m", price: catalogPriceExVat("steelcity-1x1", 219), area: 1, note: "8.5kg module · deck & riser" },
  { id: "steelcity-1x520", label: "SteelCity 1×520mm", price: catalogPriceExVat("steelcity-1x520", 209), area: 0.52, note: "5kg module · deck & riser" },
  { id: "platinum-1x1", label: "Platinum ECO 1×1m", price: 269, area: 1, note: "7.8kg · recycled core · from" },
];

// Real accessories (ex VAT), from the shop & Get Started guide
const EXTRAS = [
  { id: "fascia", label: "Hard fascia valance", note: "£20 +Vat per metre", perMetre: 20, visual: "valance" as const },
  { id: "cloth", label: "Cloth valance", note: "£22 +Vat per metre", perMetre: 22, visual: "valance" as const },
  { id: "ramp", label: "Folding access ramp 5ft", note: "£299 +Vat", flat: 299, visual: "ramp" as const },
  { id: "trolley", label: "Storage trolley 300kg", note: "£290 +Vat", flat: 290, visual: null },
] as const;

type ExtraId = (typeof EXTRAS)[number]["id"];

function Choice({
  type = "radio",
  name,
  checked,
  onChange,
  children,
  className,
}: {
  type?: "radio" | "checkbox";
  name: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className="relative block cursor-pointer">
      <input type={type} name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={cn(
          "block h-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 text-left transition duration-200",
          "hover:-translate-y-0.5 hover:border-forest-400 hover:shadow-md",
          "peer-checked:border-forest-800 peer-checked:bg-forest-50 peer-checked:shadow-[0_0_0_4px_rgba(163,230,53,0.4)]",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-forest-800 peer-focus-visible:ring-offset-2",
          className,
        )}
      >
        {children}
      </span>
    </label>
  );
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-slate-200 bg-white px-3 py-2">
      <span className="text-sm font-bold text-forest-900">{label}</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label={`Decrease ${label.toLowerCase()}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-forest-900 transition hover:bg-electric disabled:opacity-40 disabled:hover:bg-slate-100"
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <output aria-live="polite" className="w-12 text-center text-sm font-extrabold tabular-nums text-forest-900">
          {value} m
        </output>
        <button
          type="button"
          aria-label={`Increase ${label.toLowerCase()}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-forest-900 transition hover:bg-electric disabled:opacity-40 disabled:hover:bg-slate-100"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function StageConfigurator() {
  const { funding, openFunding, applyFunding, openQuote, addItem } = useStore();
  const [preset, setPreset] = useState<(typeof PRESETS)[number]["id"]>("4x3");
  const [cw, setCw] = useState(5);
  const [cd, setCd] = useState(4);
  const [heightMm, setHeightMm] = useState(400);
  const [deckId, setDeckId] = useState("steelcity-1x1");
  const [flatDeckId, setFlatDeckId] = useState("steelcity-1x1");
  const [flatHeightMm, setFlatHeightMm] = useState(400);
  const [extras, setExtras] = useState<Record<ExtraId, boolean>>({ fascia: false, cloth: false, ramp: false, trolley: false });
  const [stageMode, setStageMode] = useState<"flat" | "tiered">("flat");
  const [tierRows, setTierRows] = useState(3);

  const availableHeights = useMemo(() => {
    if (stageMode === "flat") return HEIGHTS;
    const maxRiserHeight = 1000 - (tierRows - 1) * 200 - 30;
    return HEIGHTS.filter((height) => height <= maxRiserHeight);
  }, [stageMode, tierRows]);
  const heightGridClass = stageMode === "flat"
    ? "grid-cols-3 sm:grid-cols-6"
    : tierRows === 4
      ? "grid-cols-2 sm:grid-cols-2"
      : tierRows === 3
        ? "grid-cols-3 sm:grid-cols-3"
        : tierRows === 2
          ? "grid-cols-2 sm:grid-cols-4"
          : "grid-cols-3 sm:grid-cols-5";

  const changeStageMode = (mode: "flat" | "tiered") => {
    if (mode === stageMode) return;
    if (mode === "tiered") {
      setFlatDeckId(deckId);
      setStageMode(mode);
      setDeckId("steelcity-1x520");
      setHeightMm(200);
    } else {
      setStageMode(mode);
      setDeckId(flatDeckId);
      setHeightMm(flatHeightMm);
    }
  };

  const changeTierRows = (rows: number) => {
    setTierRows(rows);
    const maxRiserHeight = 1000 - (rows - 1) * 200 - 30;
    const allowedHeights = HEIGHTS.filter((height) => height <= maxRiserHeight);
    if (heightMm > maxRiserHeight && allowedHeights.length) setHeightMm(allowedHeights[allowedHeights.length - 1]);
  };

  const changeHeight = (height: number) => {
    setHeightMm(height);
    if (stageMode === "flat") setFlatHeightMm(height);
  };

  const changeDeck = (id: string) => {
    setDeckId(id);
    if (stageMode === "flat") setFlatDeckId(id);
  };

  const calc = useMemo(() => {
    const p = PRESETS.find((x) => x.id === preset)!;
    const w = preset === "custom" ? cw : p.w;
    const isChoir = stageMode === "tiered";
    const d = isChoir ? tierRows * 0.52 : preset === "custom" ? cd : p.d;
    const area = w * d;
    const selectedDeckId = isChoir ? "steelcity-1x520" : deckId;
    const deck = DECK_TYPES.find((x) => x.id === selectedDeckId)!;
    const modules = Math.max(1, isChoir ? Math.round(area / deck.area) : Math.ceil(area / deck.area));
    const flatPackage = !isChoir && deckId === "steelcity-1x1" && preset !== "custom"
      ? PRODUCTS.find((product) => product.id === FLAT_PACKAGE_IDS[preset])
      : undefined;
    const usesStandardChoirPackage = isChoir && w === 4 && tierRows === 3 && heightMm === 200 && !!STANDARD_CHOIR_PACKAGE;
    const usesCatalogPackage = usesStandardChoirPackage || !!flatPackage;
    const catalogPackagePrice = usesStandardChoirPackage ? STANDARD_CHOIR_PACKAGE?.price : flatPackage?.price;
    const base = usesCatalogPackage && catalogPackagePrice != null
      ? catalogPackagePrice / 1.2
      : modules * deck.price;
    let extrasTotal = 0;
    for (const e of EXTRAS) {
      if (!extras[e.id]) continue;
      if ("perMetre" in e) extrasTotal += 2 * (w + d) * e.perMetre;
      else if ("flat" in e) extrasTotal += e.flat;
    }
    const subtotal = base + extrasTotal; // ex VAT
    const pct = funding?.pct ?? 0;
    const total = subtotal * (1 - pct / 100);
    const tierHeightValues = isChoir
      ? Array.from({ length: tierRows }, (_, row) => heightMm + 30 + (tierRows - 1 - row) * 200)
      : [heightMm + 30];
    const heightDetail = isChoir
      ? `${tierHeightValues.join(" / ")}mm incl. deck`
      : `${heightMm}mm riser (${heightMm + 30}mm incl. deck)`;
    const configuration = isChoir
      ? `Tiered choir · ${tierRows} ${tierRows === 1 ? "row" : "rows"}`
      : "Flat stage · single level";
    const priceBasis = usesStandardChoirPackage
      ? `${STANDARD_CHOIR_PACKAGE!.name} · live shop package price`
      : flatPackage
        ? `${flatPackage.name} · live shop package price`
      : isChoir
        ? `${modules} SteelCity 1×520mm modules at ${formatGBP(deck.price)} + VAT each`
        : `${modules} ${deck.label} modules at ${formatGBP(deck.price)} + VAT each`;
    return {
      w,
      d,
      area,
      modules,
      deck,
      base,
      extrasTotal,
      subtotal,
      total,
      totalIncVat: total * 1.2,
      pct,
      isChoir,
      tierRows: isChoir ? tierRows : 1,
      tierHeightValues,
      heightDetail,
      configuration,
      priceBasis,
      usesStandardChoirPackage,
      usesCatalogPackage,
      sizeLabel: isChoir
        ? `${w}m choir layout · ${tierRows} ${tierRows === 1 ? "row" : "rows"}`
        : preset === "custom"
          ? `Custom ${w}×${d}m`
          : p.label.replace(/\s/g, ""),
    };
  }, [preset, cw, cd, deckId, extras, funding, stageMode, tierRows, heightMm]);

  const extrasList = EXTRAS.filter((e) => extras[e.id]).map((e) => e.label);

  const buildSummary = () => ({
    sizeLabel: calc.sizeLabel,
    dims: calc.isChoir ? `${calc.w}m wide × ${calc.d.toFixed(2)}m deep` : `${calc.w}m × ${calc.d}m`,
    decks: calc.modules,
    heightCm: heightMm / 10,
    configuration: calc.configuration,
    heightDetail: calc.heightDetail,
    deckType: calc.deck.label,
    extras: extrasList,
    subtotal: calc.subtotal,
    discountPct: calc.pct,
    code: funding ? ECAL_REFERENCE : undefined,
    priceBasis: calc.priceBasis,
    total: calc.total,
    totalIncVat: calc.totalIncVat,
  });

  const addToBasket = () =>
    addItem({
      id: `stage-${calc.w}x${calc.d}-${heightMm}-${calc.deck.id}-${EXTRAS.filter((e) => extras[e.id]).map((e) => e.id).join("+")}-${calc.isChoir ? `choir-${calc.tierRows}` : "flat"}`,
      name: `${calc.isChoir ? "Choir Stage" : "Custom Stage"} ${calc.sizeLabel} · ${calc.deck.label}`,
      // Basket applies any ECAL discount, so store the pre-discount inc-VAT estimate here.
      price: Math.round(calc.subtotal * 1.2 * 100) / 100,
      image: calc.isChoir ? IMAGES.choirTiers : IMAGES.pkg4x3,
      meta: `${calc.configuration} · ${calc.modules} modules${extrasList.length ? " + " + extrasList.join(", ") : ""} · inc VAT`,
    });

  return (
    <section
      id="quote-builder"
      aria-labelledby="configurator-heading"
      className="relative z-30 -mt-20 px-4 sm:px-6 lg:-mt-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-7xl rounded-[28px] bg-gradient-to-br from-electric via-forest-500 to-electric/40 p-[2px] shadow-[0_30px_80px_-20px_rgba(6,24,15,0.6),0_0_60px_-10px_rgba(163,230,53,0.45)]"
      >
        <div className="overflow-hidden rounded-[26px] bg-white">
          {/* Header strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-4 sm:px-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-900 text-electric">
                <Ruler className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 id="configurator-heading" className="text-xl font-extrabold tracking-tight text-forest-900 sm:text-2xl">
                  Build Your Stage
                </h2>
                <p className="text-sm text-slate-600">Choose a layout, set the height and see exactly what the estimate includes.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-forest-900 px-3.5 py-1.5 text-xs font-bold text-electric">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" /> Free UK quotation
              </span>
              <button
                type="button"
                onClick={openFunding}
                className="inline-flex items-center gap-1.5 rounded-full bg-electric px-3.5 py-1.5 text-xs font-extrabold text-forest-900 shadow-sm transition hover:bg-lime-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-800 focus-visible:ring-offset-2"
              >
                <Ticket className="h-3.5 w-3.5" aria-hidden="true" /> Get ECAL discounted pricing on this quote
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12">
            {/* Controls */}
            <div className="flex flex-col gap-6 p-5 sm:p-8 lg:col-span-7">
              <fieldset>
                <legend className="mb-3 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-forest-900">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-electric text-xs text-forest-900">1</span>
                  {stageMode === "tiered" ? "Choir stage width" : "Stage size"}
                </legend>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {PRESETS.map((p) => (
                    <Choice key={p.id} name="stage-size" checked={preset === p.id} onChange={() => setPreset(p.id)}>
                      <span className="block text-base font-extrabold text-forest-900">
                        {stageMode === "tiered" ? (p.id === "custom" ? "Custom width" : `${p.w}m wide`) : p.label}
                      </span>
                      <span className="block text-xs text-slate-600">
                        {p.id === "custom"
                          ? p.tag
                          : stageMode === "tiered"
                            ? `${p.w * tierRows} modules · ${p.w === 4 && tierRows === 3 ? "standard choir package" : `${tierRows} ${tierRows === 1 ? "row" : "rows"}`}`
                            : `${p.w * p.d} m² · ${p.tag}`}
                      </span>
                    </Choice>
                  ))}
                </div>
                {preset === "custom" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 grid gap-2.5 overflow-hidden sm:grid-cols-2">
                    <Stepper label="Width" value={cw} min={1} max={12} onChange={setCw} />
                    {stageMode === "flat" && <Stepper label="Depth" value={cd} min={1} max={8} onChange={setCd} />}
                  </motion.div>
                )}
              </fieldset>

              <fieldset>
                <legend className="mb-3 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-forest-900">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-electric text-xs text-forest-900">2</span>
                  Stage Configuration
                  <span className="hidden rounded-full bg-forest-100 px-2 py-0.5 text-[11px] font-bold normal-case tracking-normal text-forest-700 sm:inline-flex">
                    Flat or Tiered Choir
                  </span>
                </legend>
                {/* Mode toggle — Flat vs Tiered */}
                <div className="grid grid-cols-2 gap-2.5">
                  <Choice name="stage-mode" checked={stageMode === "flat"} onChange={() => changeStageMode("flat")}>
                    <span className="flex items-center gap-2 text-sm font-extrabold text-forest-900">
                      <Layers className="h-4 w-4 text-forest-600" aria-hidden="true" /> Flat Stage
                    </span>
                    <span className="block text-xs text-slate-600">One level · bands, assemblies &amp; events</span>
                  </Choice>
                  <Choice name="stage-mode" checked={stageMode === "tiered"} onChange={() => changeStageMode("tiered")}>
                    <span className="flex items-center gap-2 text-sm font-extrabold text-forest-900">
                      <Users className="h-4 w-4 text-forest-600" aria-hidden="true" /> Tiered — Choir / Seating
                    </span>
                    <span className="block text-xs text-slate-600">1×520mm modules · stepped rows</span>
                  </Choice>
                </div>

                {/* Row count changes the module count, footprint, preview and estimate. */}
                {stageMode === "tiered" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 overflow-hidden">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-forest-700">How many choir rows?</p>
                      <span className="text-xs font-semibold text-slate-600">{tierRows * calc.w} modules · {calc.area.toFixed(2)}m² footprint</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                      {[1, 2, 3, 4].map((n) => (
                        <Choice key={n} name="tier-rows" checked={tierRows === n} onChange={() => changeTierRows(n)}>
                          <span className="flex items-center justify-between gap-1">
                            <span className="text-sm font-extrabold text-forest-900">{n} {n === 1 ? "row" : "rows"}</span>
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-forest-700">{n}</span>
                          </span>
                          <span className="mt-1 block text-xs leading-snug text-slate-600">
                            {n === 1
                              ? "Single level"
                              : n === 3 && calc.w === 4
                                ? "Standard package · up to 35 singers"
                                : `${calc.w * n} × 520mm modules`}
                          </span>
                        </Choice>
                      ))}
                    </div>
                    <p className="mt-3 flex items-start gap-1.5 rounded-xl bg-forest-50 px-3 py-2 text-xs leading-relaxed text-slate-700">
                      <Music2 className="h-3.5 w-3.5 shrink-0 text-forest-600" aria-hidden="true" />
                      Rows rise by 200mm toward the back. Height, module count and the estimate update together.
                    </p>
                  </motion.div>
                )}
                {stageMode === "flat" && (
                  <p className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-600">
                    <GraduationCap className="h-3.5 w-3.5 shrink-0 text-forest-600" aria-hidden="true" />
                    Choose Tiered for a choir or seating-bank layout. The 4m, 3-row option matches the live choir package.
                  </p>
                )}
              </fieldset>

              <fieldset>
                <legend className="mb-3 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-forest-900">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-electric text-xs text-forest-900">3</span>
                  {stageMode === "tiered" ? "Lowest row riser height" : "Stage height"}
                </legend>
                <div className={`grid gap-2 ${heightGridClass}`}>
                  {availableHeights.map((h) => (
                    <Choice key={h} name="stage-height" checked={heightMm === h} onChange={() => changeHeight(h)} className="px-1 text-center">
                      <span className="block text-base font-extrabold text-forest-900">{h}</span>
                      <span className="block text-[11px] font-semibold text-slate-600">mm</span>
                    </Choice>
                  ))}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {stageMode === "tiered"
                    ? `Each rise adds 200mm. Heights shown in the preview include the 30mm deck (${calc.heightDetail}).`
                    : "Every module is a deck & riser combo. Choose the riser height that suits your venue."}
                </p>
              </fieldset>

              <fieldset>
                <legend className="mb-3 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-forest-900">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-electric text-xs text-forest-900">4</span>
                  {stageMode === "tiered" ? "Choir modules" : "Stage modules"}
                  <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold normal-case tracking-normal text-slate-600">
                    {calc.modules} × module
                  </span>
                </legend>
                <div className="grid gap-2.5 sm:grid-cols-3">
                  {DECK_TYPES.filter((t) => stageMode === "flat" || t.id === "steelcity-1x520").map((t) => (
                    <Choice key={t.id} name="deck-type" checked={calc.deck.id === t.id} onChange={() => changeDeck(t.id)}>
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-sm font-extrabold text-forest-900">{t.label}</span>
                        <span className="text-sm font-bold text-forest-700">{formatGBP(t.price)}</span>
                      </span>
                      <span className="block text-xs text-slate-600">{t.note} · +Vat</span>
                    </Choice>
                  ))}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {stageMode === "tiered"
                    ? "Choir rows use the 1×520mm SteelCity deck & riser module, matching NexGen’s 3 Tier Choir package."
                    : "Choose a module finish and size. The estimate updates by module count; the official quote confirms your final selection."}
                </p>
              </fieldset>

              <fieldset>
                <legend className="mb-3 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-forest-900">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs text-forest-900">+</span>
                  Optional accessories
                </legend>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {EXTRAS.map((e) => (
                    <Choice key={e.id} type="checkbox" name={`extra-${e.id}`} checked={extras[e.id]} onChange={() => setExtras((s) => ({ ...s, [e.id]: !s[e.id] }))}>
                      <span className="flex items-center gap-2 text-sm font-extrabold text-forest-900">
                        <span
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded border-2 transition",
                            extras[e.id] ? "border-forest-800 bg-forest-800 text-electric" : "border-slate-300",
                          )}
                          aria-hidden="true"
                        >
                          {extras[e.id] && <BadgeCheck className="h-3 w-3" />}
                        </span>
                        {e.label}
                      </span>
                      <span className="mt-0.5 block pl-6 text-xs text-slate-600">{e.note}</span>
                    </Choice>
                  ))}
                </div>
              </fieldset>

              <ul className="mt-auto grid gap-2 rounded-2xl bg-slate-50 p-3.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 sm:grid-cols-3">
                {["Totally magnetic — no locks to replace", "Lifespan of up to 15 years", "UK manufactured in Sheffield"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Preview + price */}
            <div className="relative overflow-hidden bg-forest-900 p-5 text-white sm:p-8 lg:col-span-5">
              <div className="absolute inset-0 bg-grid-lime" aria-hidden="true" />
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-electric/20 blur-3xl" aria-hidden="true" />
              <div className="relative flex h-full flex-col">
                <div className="relative flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-electric/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-electric ring-1 ring-electric/30">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Live preview
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/90">
                    {calc.isChoir
                      ? `${calc.w}m wide · ${calc.tierRows} ${calc.tierRows === 1 ? "row" : "rows"}`
                      : `Flat stage · ${calc.w}m × ${calc.d}m`}
                  </span>
                </div>

                <div className="relative mt-2 h-[210px] sm:h-[240px]">
                  <IsoStage
                    w={calc.w}
                    d={calc.d}
                    heightCm={(heightMm + 30) / 10}
                    valance={extras.fascia || extras.cloth}
                    steps={false}
                    ramp={extras.ramp}
                    tierRows={calc.isChoir ? calc.tierRows : 1}
                  />
                  {calc.isChoir && (
                    <span className="absolute bottom-2 left-2 rounded-full bg-forest-900/80 px-2.5 py-1 text-[11px] font-bold text-electric ring-1 ring-electric/40 backdrop-blur">
                      {calc.tierRows} {calc.tierRows === 1 ? "Row" : "Rows"} · Choir Layout
                    </span>
                  )}
                </div>

                <dl className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { icon: Layers, label: "Modules", value: calc.modules },
                    { icon: Ruler, label: calc.isChoir ? "Footprint" : "Area", value: `${calc.area.toFixed(calc.isChoir ? 2 : 0)} m²` },
                    { icon: Clock, label: calc.isChoir ? "Rows" : "Build", value: calc.isChoir ? `${calc.tierRows}` : "~60 sec" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-white/[0.07] px-2 py-2.5 ring-1 ring-white/10">
                      <dt className="flex items-center justify-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-white/70">
                        <s.icon className="h-3 w-3 text-electric" aria-hidden="true" />
                        {s.label}
                      </dt>
                      <dd className="mt-0.5 text-base font-extrabold">{s.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-5 rounded-2xl bg-black/25 p-4 ring-1 ring-white/10" aria-live="polite">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/70">Instant estimate · ex. VAT</p>
                  <div className="mt-1 flex flex-wrap items-end gap-x-3">
                    <p className="text-[44px] font-extrabold leading-none tracking-tight text-electric">
                      <AnimatedNumber value={calc.total} format={formatGBP} />
                    </p>
                    {calc.pct > 0 && (
                      <p className="pb-1 text-sm font-semibold text-white/60 line-through">{formatGBP(calc.subtotal)}</p>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-white/70">
                    {formatGBP2(calc.totalIncVat)} inc VAT · {calc.heightDetail}
                  </p>
                  <p className="mt-2 text-[11px] leading-relaxed text-white/70">{calc.priceBasis}</p>
                  <details className="mt-3 overflow-hidden rounded-xl bg-white/[0.06] ring-1 ring-white/10">
                    <summary className="cursor-pointer px-3 py-2 text-xs font-bold text-white/85 transition hover:text-electric">
                      See estimate breakdown
                    </summary>
                    <dl className="space-y-1.5 border-t border-white/10 px-3 pb-3 pt-2 text-xs text-white/75">
                      <div className="flex justify-between gap-3">
                        <dt>
                          {calc.usesCatalogPackage
                            ? calc.isChoir
                              ? "3 Tier Choir package"
                              : "NexGen stage package"
                            : `${calc.modules} × ${calc.deck.label}`}
                        </dt>
                        <dd className="font-semibold tabular-nums">{formatGBP2(calc.base)}</dd>
                      </div>
                      {calc.extrasTotal > 0 && (
                        <div className="flex justify-between gap-3">
                          <dt>Selected accessories</dt>
                          <dd className="font-semibold tabular-nums">{formatGBP2(calc.extrasTotal)}</dd>
                        </div>
                      )}
                      <div className="flex justify-between gap-3 border-t border-white/10 pt-1.5">
                        <dt>Estimate ex. VAT</dt>
                        <dd className="font-semibold tabular-nums">{formatGBP2(calc.subtotal)}</dd>
                      </div>
                      {calc.pct > 0 && (
                        <div className="flex justify-between gap-3 text-electric">
                          <dt>ECAL funding ({calc.pct}%)</dt>
                          <dd className="font-semibold tabular-nums">−{formatGBP2(calc.subtotal - calc.total)}</dd>
                        </div>
                      )}
                      <div className="flex justify-between gap-3 border-t border-white/10 pt-1.5 font-bold text-white">
                        <dt>Estimate inc. VAT</dt>
                        <dd className="tabular-nums">{formatGBP2(calc.totalIncVat)}</dd>
                      </div>
                    </dl>
                  </details>
                  {calc.pct > 0 && (
                    <p className="mt-1 text-xs font-semibold text-electric">
                      Includes up to {calc.pct}% {ECAL_REFERENCE} funding — final discount confirmed on your official quotation.
                    </p>
                  )}

                  {funding ? (
                    <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-electric/15 px-3 py-2 text-xs font-bold text-electric ring-1 ring-electric/30">
                      <span className="flex items-center gap-1.5">
                        <Ticket className="h-3.5 w-3.5" aria-hidden="true" /> {ECAL_REFERENCE} · up to {funding.pct}% funding applied
                      </span>
                      <button type="button" onClick={() => applyFunding(null)} aria-label="Remove ECAL funding" className="rounded p-0.5 hover:bg-white/10">
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={openFunding}
                      className="mt-3 flex w-full items-center justify-between gap-2 rounded-lg bg-white/10 px-3 py-2 text-left text-xs font-semibold text-white transition hover:bg-white/15"
                    >
                      <span className="flex items-center gap-1.5">
                        <Ticket className="h-3.5 w-3.5 text-electric" aria-hidden="true" />
                        Education, Charity, Arts or Leisure? Save up to 20% with ECAL funding
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-electric" aria-hidden="true" />
                    </button>
                  )}
                </div>

                <div className="mt-4 grid gap-2.5 sm:grid-cols-5 lg:grid-cols-1 xl:grid-cols-5">
                  <button
                    type="button"
                    onClick={() => openQuote(buildSummary())}
                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-electric px-5 py-3.5 text-sm font-extrabold text-forest-900 transition hover:bg-lime-300 sm:col-span-3 lg:col-span-1 xl:col-span-3 animate-glow"
                  >
                    <span className="absolute inset-y-0 left-0 w-1/3 bg-white/50 blur-md animate-shine" aria-hidden="true" />
                    <span className="relative">Get Instant Official Quote</span>
                    <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={addToBasket}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3.5 text-sm font-bold text-white transition hover:border-electric hover:bg-white/15 sm:col-span-2 lg:col-span-1 xl:col-span-2"
                  >
                    <ShoppingBasket className="h-4 w-4 text-electric" aria-hidden="true" />
                    Add to basket
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
