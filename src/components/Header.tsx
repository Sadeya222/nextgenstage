import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  LogIn,
  Mail,
  Menu,
  Package,
  Phone,
  Search,
  ShoppingBasket,
  Ticket,
  User,
  UserPlus,
  X,
  FileText,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Overlay } from "@/components/ui/Overlay";
import { SearchBox } from "@/components/SearchBox";
import { BUSINESS, CATEGORIES, IMAGES, NAV_LINKS } from "@/data/content";
import { useStore } from "@/context/StoreContext";
import { formatGBP } from "@/utils/format";
import { cn } from "@/utils/cn";

function ShopMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      <div className="col-span-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Shop by range</p>
        <ul className="mt-3 grid grid-cols-2 gap-3">
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <a
                href={c.href}
                onClick={onNavigate}
                className="group flex items-center gap-3 rounded-2xl border border-transparent p-2.5 transition hover:border-forest-200 hover:bg-forest-50"
              >
                <img src={c.image} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" loading="lazy" />
                <span className="min-w-0">
                  <span className="block text-sm font-bold leading-snug text-forest-900">{c.title}</span>
                  <span className="mt-0.5 block text-xs text-slate-600">
                    {c.count} products · from {formatGBP(c.from)} inc VAT
                  </span>
                </span>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 -translate-x-1 text-forest-700 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
              </a>
            </li>
          ))}
          <li>
            <a
              href="/product-category/spare-parts/"
              onClick={onNavigate}
              className="group flex h-full items-center gap-3 rounded-2xl border border-dashed border-slate-300 p-2.5 transition hover:border-forest-400 hover:bg-forest-50"
            >
              <img src={IMAGES.floorPads} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" loading="lazy" />
              <span className="min-w-0">
                <span className="block text-sm font-bold leading-snug text-forest-900">Spare Parts & Maintenance</span>
                <span className="mt-0.5 block text-xs text-slate-600">20 products · riser & deck parts</span>
              </span>
              <ArrowRight className="ml-auto h-4 w-4 shrink-0 -translate-x-1 text-forest-700 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href="/shop/"
              onClick={onNavigate}
              className="group flex h-full items-center gap-3 rounded-2xl border border-dashed border-slate-300 p-2.5 transition hover:border-forest-400 hover:bg-forest-50"
            >
              <img src={IMAGES.backdropKit} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" loading="lazy" />
              <span className="min-w-0">
                <span className="block text-sm font-bold leading-snug text-forest-900">Backdrops & Display</span>
                <span className="mt-0.5 block text-xs text-slate-600">Fastfix pipe & drape kits</span>
              </span>
              <ArrowRight className="ml-auto h-4 w-4 shrink-0 -translate-x-1 text-forest-700 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
      <div className="relative col-span-4 overflow-hidden rounded-2xl bg-forest-900 text-white">
        <img src={IMAGES.pkg4x3} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/50 to-transparent" aria-hidden="true" />
        <div className="relative flex h-full min-h-[180px] flex-col justify-end p-4">
          <span className="w-fit rounded-full bg-electric px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-forest-900">
            Popular
          </span>
          <p className="mt-2 text-base font-extrabold leading-tight">NexGen Staging Package 4×3m</p>
          <p className="text-xs text-white/75">12 SteelCity modules · {formatGBP(3153.6)} inc VAT</p>
          <a
            href="/product/nexgen-portable-staging-package-4x3m/"
            onClick={onNavigate}
            className="mt-3 inline-flex w-fit items-center gap-1 text-xs font-bold text-electric hover:underline"
          >
            View package <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const { count, openCart, openFunding } = useStore();
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileShop, setMobileShop] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!accountRef.current?.contains(e.target as Node)) setAccountOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShopOpen(false);
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const openShop = () => {
    window.clearTimeout(hoverTimer.current);
    setShopOpen(true);
  };
  const closeShopSoon = () => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setShopOpen(false), 140);
  };

  return (
    <>
      <header className={cn("sticky top-0 z-50 transition-shadow duration-300", scrolled && "shadow-[0_10px_40px_-12px_rgba(6,24,15,0.45)]")}>
        {/* Tier 1: logo, search, account, basket */}
        <div className="on-light relative z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-3 py-2.5 sm:gap-3 sm:px-6 lg:gap-8 lg:py-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-haspopup="dialog"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-forest-900 transition hover:bg-slate-100 sm:h-11 sm:w-11 lg:hidden"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            <Logo className="min-w-0 shrink" />

            <SearchBox className="hidden max-w-xl flex-1 lg:block" />

            <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
              <a
                href={`tel:${BUSINESS.phoneHref}`}
                className="mr-2 hidden items-center gap-2 text-sm font-bold text-forest-900 xl:flex"
                aria-label={`Call us on ${BUSINESS.phone}`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-50 text-forest-700">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="leading-tight">
                  {BUSINESS.phone}
                  <span className="block text-[11px] font-medium text-slate-600">Sheffield · UK manufacturer</span>
                </span>
              </a>

              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                aria-label="Toggle search"
                aria-expanded={searchOpen}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-forest-900 transition hover:bg-slate-100 sm:h-11 sm:w-11 lg:hidden"
              >
                {searchOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Search className="h-5 w-5" aria-hidden="true" />}
              </button>

              <div ref={accountRef} className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  aria-label="Account menu"
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-forest-900 transition hover:bg-slate-100"
                >
                  <User className="h-5 w-5" aria-hidden="true" />
                </button>
                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      role="menu"
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-[calc(100%+8px)] z-50 w-60 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl"
                    >
                      {[
                        { icon: LogIn, label: "Sign in" },
                        { icon: UserPlus, label: "Create account" },
                        { icon: Package, label: "Track my order" },
                        { icon: FileText, label: "Saved stage quotes" },
                      ].map((i) => (
                        <button
                          key={i.label}
                          role="menuitem"
                          type="button"
                          onClick={() => setAccountOpen(false)}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-forest-900 transition hover:bg-forest-50"
                        >
                          <i.icon className="h-4 w-4 text-forest-600" aria-hidden="true" />
                          {i.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="button"
                onClick={openCart}
                aria-label={`Open basket, ${count} item${count === 1 ? "" : "s"}`}
                className="relative ml-1 inline-flex h-10 items-center gap-2 rounded-xl bg-forest-900 px-3 text-sm font-bold text-white transition hover:bg-forest-800 sm:ml-0 sm:h-11 sm:px-4"
              >
                <ShoppingBasket className="h-5 w-5 text-electric" aria-hidden="true" />
                <span className="hidden sm:inline">Basket</span>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-electric px-1 text-[11px] font-extrabold text-forest-900 ring-2 ring-white"
                    aria-hidden="true"
                  >
                    {count}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Mobile search row */}
          <AnimatePresence initial={false}>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-visible px-4 pb-3 lg:hidden"
              >
                <SearchBox autoFocus onDone={() => setSearchOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tier 2: primary navigation */}
        <nav aria-label="Primary" className="relative hidden bg-forest-900 lg:block" ref={navRef}>
          <div className="absolute inset-0 bg-diagonal-lines opacity-60" aria-hidden="true" />
          <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6">
            <ul className="flex items-center">
              {NAV_LINKS.map((l) => {
                const isShop = !!l.hasMenu;
                return (
                  <li
                    key={l.label}
                    onMouseEnter={isShop ? openShop : undefined}
                    onMouseLeave={isShop ? closeShopSoon : undefined}
                    onFocus={isShop ? openShop : undefined}
                    onBlur={
                      isShop
                        ? (e) => {
                            if (!navRef.current?.contains(e.relatedTarget as Node)) setShopOpen(false);
                          }
                        : undefined
                    }
                    className="relative"
                  >
                    <a
                      href={l.href}
                      onClick={(e) => {
                        if (l.action === "funding" || l.href === "/quote-me/") {
                          e.preventDefault();
                          openFunding();
                        }
                        setShopOpen(false);
                      }}
                      aria-haspopup={isShop ? "true" : undefined}
                      aria-expanded={isShop ? shopOpen : undefined}
                      className={cn(
                        "group relative inline-flex items-center gap-1 px-4 py-3.5 text-sm font-bold tracking-wide text-white/90 transition hover:text-electric",
                        isShop && shopOpen && "text-electric",
                      )}
                    >
                      {l.label}
                      {isShop && (
                        <ChevronDown className={cn("h-4 w-4 transition-transform", shopOpen && "rotate-180")} aria-hidden="true" />
                      )}
                      {l.action === "funding" && (
                        <span className="ml-1 rounded bg-electric px-1.5 py-0.5 text-[9px] font-extrabold leading-none text-forest-900">
                          10–20%
                        </span>
                      )}
                      <span
                        className={cn(
                          "absolute inset-x-4 bottom-2 h-0.5 origin-left scale-x-0 rounded-full bg-electric transition-transform duration-300 group-hover:scale-x-100",
                          isShop && shopOpen && "scale-x-100",
                        )}
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
            <p className="flex items-center gap-2 text-xs font-semibold text-white/75">
              <Mail className="h-3.5 w-3.5 text-electric" aria-hidden="true" />
              Over 20 years' UK stage manufacturing experience
            </p>
          </div>

          {/* Mega menu */}
          <AnimatePresence>
            {shopOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                onMouseEnter={openShop}
                onMouseLeave={closeShopSoon}
                className="on-light absolute left-1/2 top-full z-50 w-[min(60rem,calc(100vw-3rem))] -translate-x-1/2"
              >
                <div className="overflow-hidden rounded-b-3xl border border-t-0 border-slate-200 bg-white shadow-2xl shadow-forest-950/25">
                  <div className="h-1 bg-gradient-to-r from-electric via-electric-deep to-forest-600" aria-hidden="true" />
                  <ShopMenu onNavigate={() => setShopOpen(false)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Mobile drawer */}
      <Overlay
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        side="left"
        label="Main menu"
        closeTone="light"
        className="h-full w-[88%] max-w-sm overflow-y-auto bg-forest-900 text-white shadow-2xl"
      >
        <div className="relative min-h-full">
          <div className="absolute inset-0 bg-grid-lime opacity-60" aria-hidden="true" />
          <div className="relative p-5 pt-6">
            <Logo tone="light" />
            <nav aria-label="Mobile primary" className="mt-8">
              <ul className="space-y-1">
                {NAV_LINKS.map((l) => (
                  <li key={l.label}>
                    {l.hasMenu ? (
                      <>
                        <button
                          type="button"
                          aria-expanded={mobileShop}
                          onClick={() => setMobileShop((v) => !v)}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-3.5 text-left text-lg font-bold text-white transition hover:bg-white/10"
                        >
                          {l.label}
                          <ChevronDown className={cn("h-5 w-5 text-electric transition-transform", mobileShop && "rotate-180")} aria-hidden="true" />
                        </button>
                        <AnimatePresence initial={false}>
                          {mobileShop && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              {CATEGORIES.map((c) => (
                                <li key={c.id}>
                                  <a
                                    href="#shop"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/10"
                                  >
                                    <img src={c.image} alt="" className="h-11 w-11 rounded-lg object-cover" loading="lazy" />
                                    <span className="text-sm font-semibold text-white/90">{c.title}</span>
                                  </a>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <a
                        href={l.href}
                        onClick={(e) => {
                          if (l.action === "funding" || l.href === "/quote-me/") {
                            e.preventDefault();
                            setMobileOpen(false);
                            openFunding();
                          } else setMobileOpen(false);
                        }}
                        className="flex items-center justify-between rounded-xl px-3 py-3.5 text-lg font-bold text-white transition hover:bg-white/10"
                      >
                        <span className="flex items-center gap-2">
                          {l.label}
                          {l.action === "funding" && (
                            <span className="rounded bg-electric px-1.5 py-0.5 text-[10px] font-extrabold text-forest-900">10–20%</span>
                          )}
                        </span>
                        <ArrowRight className="h-4 w-4 text-electric/70" aria-hidden="true" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openFunding();
              }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-electric px-4 py-3.5 font-extrabold text-forest-900 transition hover:bg-lime-300"
            >
              <Ticket className="h-5 w-5" aria-hidden="true" /> Get funding code
            </button>

            <div className="mt-8 space-y-3 border-t border-white/10 pt-6 text-sm text-white/80">
              <button type="button" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 font-semibold hover:text-electric">
                <User className="h-4 w-4 text-electric" aria-hidden="true" /> Sign in / Create account
              </button>
              <a href={`tel:${BUSINESS.phoneHref}`} className="flex items-center gap-3 font-semibold hover:text-electric">
                <Phone className="h-4 w-4 text-electric" aria-hidden="true" /> {BUSINESS.phone}
              </a>
              <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-3 font-semibold hover:text-electric">
                <Mail className="h-4 w-4 text-electric" aria-hidden="true" /> {BUSINESS.email}
              </a>
            </div>
          </div>
        </div>
      </Overlay>
    </>
  );
}
