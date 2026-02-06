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
import AcceptorView from "./pages/AcceptorView";
import PriceView from "./pages/PriceView";
import InquiryView from "./pages/InquiryView";
import ReviewView from "./pages/ReviewView";

function AppContent() {
  const location = useLocation();
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  const [headerState, setHeaderState] = useState("default");
  const [hasScrolledOnce, setHasScrolledOnce] = useState(false);
  const [viewMode, setViewMode] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [isPageTransition, setIsPageTransition] = useState(false);

  const mainCardsRef = useRef(null);
  const inquiryTriggerRef = useRef(null);

  useEffect(() => {
    // 메인페이지에서만 Observer 작동
    if (viewMode) return;

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
  }, [hasScrolledOnce, viewMode]);

  useEffect(() => {
    // 메인페이지에서만 Observer 작동
    if (viewMode) return;

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
  }, [hasScrolledOnce, viewMode]);

  useEffect(() => {
    // 메인페이지에서만 스크롤 이벤트 작동
    if (viewMode) return;

    const handleScroll = () => {
      if (!hasScrolledOnce) setHasScrolledOnce(true);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolledOnce, viewMode]);

  const handleNavigate = (mode) => {
    if (mode === "home") {
      console.log("[Front] Starting return animation");
      setIsReturning(true);
      setIsAnimating(true); // 반대로 내려가게 하기 위해 추가
      setHeaderState("default"); // 즉시 headerState 초기화

      setTimeout(() => {
        console.log("[Front] Return animation complete, clearing viewMode");
        setViewMode(null);
        setIsReturning(false);
        setIsAnimating(false);
        setIsPageTransition(false);
      }, 700);
      return;
    }

    // 메인페이지에서 다른 페이지로 이동하는 경우
    if (!viewMode) {
      console.log("[Front] Starting navigation from main to:", mode);
      setIsAnimating(true);
      setViewMode(mode);

      setTimeout(() => {
        setIsAnimating(false);
      }, 100);
    } 
    // 다른 페이지에서 다른 페이지로 이동하는 경우
    else {
      console.log("[Front] Starting page transition from", viewMode, "to:", mode);
      setIsPageTransition(true);
      
      setTimeout(() => {
        setViewMode(mode);
        setIsPageTransition(false);
      }, 250);
    }
  };

  return (
    <div className="bg-[#EBEAF3] min-h-screen font-sans text-gray-900">
      {!isAuthPage && <Header colorType={!viewMode ? headerState : "default"} onNavigate={handleNavigate} />}

      <Routes>
        <Route
          path="/"
          element={
            <>
              {!viewMode && <MainVisual />}
              <div className="w-full transition-all duration-700 ease-in-out">
                {viewMode ? (
                  <div className="w-full h-screen flex flex-col">
                    {/* Header spacer */}
                    <div className="h-20 bg-[#EBEAF3]"></div>
                    {/* Purple section - 애니메이션으로 높이가 변함 */}
                    <div className={`bg-[#EBEAF3] transition-all duration-700 ease-out ${
                      isAnimating ? 'h-72' : 'h-16'
                    }`}></div>
                    {/* Content section with two-stage animation */}
                    <div className="bg-[#fafaf5] w-full rounded-tr-[5rem] flex-1 flex flex-col relative overflow-hidden">
                      <div
                        className={`w-full h-full flex flex-col transition-all duration-700 ease-out relative z-10 ${
                          isReturning
                            ? "transform translate-y-full opacity-0"
                            : isAnimating
                              ? "transform translate-y-full opacity-100"
                              : "transform translate-y-0 opacity-100"
                        }`}
                        style={{
                          backgroundColor: "#fafaf5",
                          borderTopRightRadius: "5rem",
                        }}
                        onTransitionEnd={() => {
                          if (isReturning) {
                            console.log("[Front] Return transition completed");
                          }
                        }}
                      >
                        <div className="flex-1 flex flex-col">
                          <div className="flex-1 flex items-start justify-center pt-10">
                            <div className={`transition-opacity duration-250 ease-in-out ${
                              isPageTransition ? 'opacity-0' : 'opacity-100'
                            }`}>
                              {viewMode === "transferor" && <TransferorView />}
                              {viewMode === "acceptor" && <AcceptorView />}
                              {viewMode === "price" && <PriceView />}
                              {viewMode === "inquiry" && <InquiryView />}
                              {viewMode === "review" && <ReviewView />}
                            </div>
                          </div>
                          <Footer />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="transform">
                    <div className="bg-[#fafaf5] rounded-tr-[5rem] shadow-[0_4px_12px_rgba(0,0,0,0.2)] px-10 pt-40 pb-16 w-full relative overflow-visible">
                      <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-10" ref={mainCardsRef}>
                        <MainCards onNavigate={handleNavigate} />
                      </div>
                      <ReviewSection />
                      <ListingTable />
                    </div>
                    <InquirySection />
                    <div ref={inquiryTriggerRef} className="h-[0px] invisible pointer-events-none" />
                  </div>
                )}
              </div>
            </>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>

      {!isAuthPage && !viewMode && (
        <div className="shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.1)] rounded-tr-[5rem]">
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
