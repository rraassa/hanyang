import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useRef, useState, useEffect } from "react";

import MainVisual from "./components/MainVisual";
import Header from "./components/Header";
import MainCards from "./components/MainCards";
import ReviewSection from "./components/ReviewSection";
import ListingTable from "./components/ListingTable";
import InquirySection from "./components/InquirySection";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TransferorView from "./pages/TransferorView";

function AppContent() {
  const location = useLocation();
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  const [headerState, setHeaderState] = useState("default");
  const [hasScrolledOnce, setHasScrolledOnce] = useState(false);
  const [viewMode, setViewMode] = useState(null);

  const mainCardsRef = useRef(null);
  const inquiryTriggerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (hasScrolledOnce) {
          setHeaderState(!entry.isIntersecting ? "scrolled" : "default");
        }
      },
      {
        threshold: 0.01,
        rootMargin: "-250px 0px 0px 0px",
      }
    );

    if (mainCardsRef.current) observer.observe(mainCardsRef.current);
    return () => observer.disconnect();
  }, [hasScrolledOnce]);

  useEffect(() => {
    const inquiryObserver = new IntersectionObserver(
      ([entry]) => {
        if (hasScrolledOnce) {
          setHeaderState(entry.isIntersecting ? "default" : "scrolled");
        }
      },
      { threshold: 0.2 }
    );

    if (inquiryTriggerRef.current) inquiryObserver.observe(inquiryTriggerRef.current);
    return () => inquiryObserver.disconnect();
  }, [hasScrolledOnce]);

  useEffect(() => {
    const handleScroll = () => {
      if (!hasScrolledOnce) setHasScrolledOnce(true);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolledOnce]);

  const handleNavigate = (mode) => {
    setViewMode(mode);
  };

  return (
    <div className="bg-[#EBEAF3] min-h-screen font-sans text-gray-900">
      {!isAuthPage && <Header colorType={headerState} onNavigate={handleNavigate} />}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <MainVisual />
              <div className="w-full transition-all duration-700 ease-in-out">
                <div
                  className={`bg-[#fafaf5] rounded-tr-[5rem] shadow-[0_4px_12px_rgba(0,0,0,0.2)] px-10 pt-40 pb-16 w-full relative overflow-visible transform transition-transform duration-700 ease-in-out ${
                    viewMode ? "-translate-y-28" : "translate-y-0"
                  }`}
                >
                  {!viewMode && (
                    <div
                      className="absolute -top-20 left-1/2 -translate-x-1/2 z-10"
                      ref={mainCardsRef}
                    >
                      <MainCards onNavigate={() => setViewMode("transferor")} />
                    </div>
                  )}

                  {!viewMode ? (
                    <>
                      <ReviewSection />
                      <ListingTable />
                    </>
                  ) : viewMode === "transferor" ? (
                    <TransferorView />
                  ) : null}
                </div>

                {!viewMode && (
                  <>
                    <InquirySection />
                    <div
                      ref={inquiryTriggerRef}
                      className="h-[0px] invisible pointer-events-none"
                    />
                  </>
                )}
              </div>
            </>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>

      {!isAuthPage && (
        <div className="shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.1)]">
          <Footer />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
