import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { IMAGES, type FundingTier } from "@/data/content";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  meta?: string;
}

export interface QuoteSummary {
  sizeLabel: string;
  dims: string;
  decks: number;
  heightCm: number;
  configuration?: string;
  heightDetail?: string;
  deckType: string;
  extras: string[];
  subtotal: number;
  discountPct: number;
  code?: string;
  priceBasis?: string;
  total: number;
  totalIncVat?: number;
}

interface StoreState {
  items: CartItem[];
  count: number;
  subtotal: number;
  funding: FundingTier | null;
  discountPct: number;
  discount: number;
  total: number;
  cartOpen: boolean;
  fundingOpen: boolean;
  quote: QuoteSummary | null;
  addItem: (item: Omit<CartItem, "qty">, qty?: number, openDrawer?: boolean) => void;
  setQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  openCart: () => void;
  closeCart: () => void;
  openFunding: () => void;
  closeFunding: () => void;
  applyFunding: (tier: FundingTier | null) => void;
  openQuote: (q: QuoteSummary) => void;
  closeQuote: () => void;
}

const StoreContext = createContext<StoreState | null>(null);

// Prices are inc VAT, exactly as displayed on the live shop.
const INITIAL_ITEMS: CartItem[] = [
  {
    id: "pkg-3x2",
    name: "NexGen Portable Staging Package 3×2m",
    price: 1579,
    qty: 1,
    image: IMAGES.pkg3x2,
    meta: "6 SteelCity modules · inc VAT",
  },
  {
    id: "valance-clips",
    name: "NexGen Valance Clips (pack of 25)",
    price: 12,
    qty: 1,
    image: IMAGES.valanceClips,
    meta: "Velcro strips · inc VAT",
  },
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS);
  const [cartOpen, setCartOpen] = useState(false);
  const [fundingOpen, setFundingOpen] = useState(false);
  const [funding, setFunding] = useState<FundingTier | null>(null);
  const [quote, setQuote] = useState<QuoteSummary | null>(null);

  const addItem = useCallback<StoreState["addItem"]>((item, qty = 1, openDrawer = true) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + qty } : p));
      return [...prev, { ...item, qty }];
    });
    if (openDrawer) setCartOpen(true);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) => (qty <= 0 ? prev.filter((p) => p.id !== id) : prev.map((p) => (p.id === id ? { ...p, qty } : p))));
  }, []);

  const removeItem = useCallback((id: string) => setItems((prev) => prev.filter((p) => p.id !== id)), []);

  const value = useMemo<StoreState>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((n, i) => n + i.qty * i.price, 0);
    const discountPct = funding?.pct ?? 0;
    const discount = subtotal * (discountPct / 100);
    return {
      items,
      count,
      subtotal,
      funding,
      discountPct,
      discount,
      total: subtotal - discount,
      cartOpen,
      fundingOpen,
      quote,
      addItem,
      setQty,
      removeItem,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      openFunding: () => setFundingOpen(true),
      closeFunding: () => setFundingOpen(false),
      applyFunding: setFunding,
      openQuote: setQuote,
      closeQuote: () => setQuote(null),
    };
  }, [items, funding, cartOpen, fundingOpen, quote, addItem, setQty, removeItem]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
