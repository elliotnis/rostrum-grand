import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header, Footer, Disclaimer, ScrollManager } from "@/components/site";
import Home from "@/pages/Home";
import { PageMotion } from "@/components/motion";
import Lab from "@/pages/Lab";
import About from "@/pages/About";
import Philanthropy from "@/pages/Philanthropy";
import { Universe, StrategyDetail } from "@/pages/Investments";
import Insights, { ArticlePage } from "@/pages/Insights";
import Contact from "@/pages/Contact";
import { Terms, Privacy, NotFound } from "@/pages/Legal";
function Site() {
  const [disclaimer, setDisclaimer] = useState(() => {
    try {
      return sessionStorage.getItem("rg-investor-notice") !== "seen";
    } catch {
      return true;
    }
  });
  const updateDisclaimer = (open: boolean) => {
    setDisclaimer(open);
    if (!open) {
      try {
        sessionStorage.setItem("rg-investor-notice", "seen");
      } catch {
        /* Session persistence is optional. */
      }
    }
  };
  return (
    <>
      <ScrollManager />
      <PageMotion paused={disclaimer} />
      <Header />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rg-lab" element={<Lab />} />
          <Route path="/investment-universe" element={<Universe />} />
          <Route
            path="/investment-universe/:slug"
            element={<StrategyDetail />}
          />
          <Route path="/about-us" element={<About />} />
          <Route path="/philanthropy" element={<Philanthropy />} />
          <Route path="/rg-corner" element={<Insights />} />
          <Route path="/rg-corner/:slug" element={<ArticlePage />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/terms-conditions" element={<Terms />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/:slug" element={<ArticlePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer onDisclaimer={() => setDisclaimer(true)} />
      <Disclaimer open={disclaimer} onOpenChange={updateDisclaimer} />
    </>
  );
}
export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}>
      <Site />
    </BrowserRouter>
  );
}
