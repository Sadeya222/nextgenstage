import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { StoreProvider } from "@/context/StoreContext";
import { PromoBar } from "@/components/PromoBar";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { StageConfigurator } from "@/components/StageConfigurator";
import { TrustBar } from "@/components/TrustBar";
import { Categories } from "@/components/Categories";
import { VideoShowcase } from "@/components/VideoShowcase";
import { Reviews } from "@/components/Reviews";
import { SeoContent } from "@/components/SeoContent";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { FundingModal } from "@/components/FundingModal";
import { QuoteModal } from "@/components/QuoteModal";

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-electric text-forest-900 shadow-[0_10px_30px_-6px_rgba(132,204,22,0.9)] transition hover:-translate-y-1 hover:bg-lime-300"
        >
          <ArrowUp className="h-5 w-5" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <a
        href="#main"
        className="sr-only z-[200] rounded-lg bg-electric px-4 py-3 font-extrabold text-forest-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <div id="top">
        <PromoBar />
        <Header />
        <main id="main">
          <Hero />
          <StageConfigurator />
          <TrustBar />
          <Categories />
          <VideoShowcase />
          <Reviews />
          <SeoContent />
          <FaqSection />
        </main>
        <Footer />
      </div>

      <CartDrawer />
      <FundingModal />
      <QuoteModal />
      <BackToTop />
    </StoreProvider>
  );
}
