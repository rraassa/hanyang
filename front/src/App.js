import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
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
import KakaoCallback from "./pages/KakaoCallback";
import TransferorView from "./pages/TransferorView";
import AcceptorView from "./pages/AcceptorView";
import PriceView from "./pages/PriceView";
import InquiryView from "./pages/InquiryView";
import ReviewView from "./pages/ReviewView";

const VIEW_MODES = new Set(["transferor", "acceptor", "price", "inquiry", "review"]);

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);
  const hasAutoLoggedOutRef = useRef(false);

  const [headerState, setHeaderState] = useState("default");
  const [hasScrolledOnce, setHasScrolledOnce] = useState(false);
  const [viewMode, setViewMode] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [isPageTransition, setIsPageTransition] = useState(false);
  const [footerRevealProgress, setFooterRevealProgress] = useState(0);

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

  useEffect(() => {
    // 서브페이지(viewMode)에서는 스크롤 위치에 따라 헤더 색상 전환
    if (!viewMode) return;

    const handleViewModeHeader = () => {
      setHeaderState(window.scrollY > 120 ? "scrolled" : "default");
    };

    handleViewModeHeader();
    window.addEventListener("scroll", handleViewModeHeader, { passive: true });
    return () => window.removeEventListener("scroll", handleViewModeHeader);
  }, [viewMode]);

  useEffect(() => {
    // 서브페이지(viewMode) 하단 근처에서 footer가 아래에서 위로 서서히 나타남
    if (!viewMode) return;

    const revealDistance = 220;
    const updateFooterReveal = () => {
      const scrollBottom = window.scrollY + window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      const distanceToBottom = Math.max(0, fullHeight - scrollBottom);
      const rawProgress = (revealDistance - distanceToBottom) / revealDistance;
      const clampedProgress = Math.min(1, Math.max(0, rawProgress));
      setFooterRevealProgress(clampedProgress);
    };

    updateFooterReveal();
    window.addEventListener("scroll", updateFooterReveal, { passive: true });
    window.addEventListener("resize", updateFooterReveal);
    return () => {
      window.removeEventListener("scroll", updateFooterReveal);
      window.removeEventListener("resize", updateFooterReveal);
    };
  }, [viewMode]);

  useEffect(() => {
    if (!viewMode) {
      setFooterRevealProgress(0);
    }
  }, [viewMode]);

  const handleNavigate = (mode) => {
    window.dispatchEvent(
      new CustomEvent("app:navigate", {
        detail: { mode },
      })
    );

    if (mode === "home") {
      if (viewMode) {
        window.history.pushState({ viewMode: null }, "", window.location.pathname);
      }
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
        setHasScrolledOnce(false);
        setHeaderState("default");
        window.scrollTo({ top: 0, behavior: "auto" });
      }, 700);
      return;
    }

    if (!VIEW_MODES.has(mode)) return;

    if (mode === viewMode) return;

    window.history.pushState({ viewMode: mode }, "", window.location.pathname);

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

  useEffect(() => {
    // 메인 복귀 직후 간헐적으로 scrolled 상태가 남는 문제 방지
    if (!viewMode && window.scrollY <= 4) {
      setHeaderState("default");
    }
  }, [viewMode]);

  useEffect(() => {
    if (location.pathname !== "/") return;

    const stateMode = window.history.state?.viewMode;
    const normalizedMode = VIEW_MODES.has(stateMode) ? stateMode : null;
    window.history.replaceState({ viewMode: normalizedMode }, "", window.location.pathname);

    if (normalizedMode !== viewMode) {
      setViewMode(normalizedMode);
      setIsAnimating(false);
      setIsReturning(false);
      setIsPageTransition(false);
      if (!normalizedMode) {
        setHasScrolledOnce(false);
        setHeaderState("default");
      }
    }

    const handlePopState = (event) => {
      const nextMode = VIEW_MODES.has(event.state?.viewMode) ? event.state.viewMode : null;
      setViewMode(nextMode);
      setIsAnimating(false);
      setIsReturning(false);
      setIsPageTransition(false);

      if (!nextMode) {
        setHasScrolledOnce(false);
        setHeaderState("default");
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [location.pathname, viewMode]);

  useEffect(() => {
    // 로그인/회원가입 페이지로 이동하면 메인 내부 뷰 상태를 정리
    if (location.pathname !== "/") {
      setViewMode(null);
      setIsAnimating(false);
      setIsReturning(false);
      setIsPageTransition(false);
      setFooterRevealProgress(0);
      setHeaderState("default");
    }
  }, [location.pathname]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) return;

    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const IDLE_TIMEOUT_MS = isAdmin ? 1000 * 60 * 15 : 1000 * 60 * 30; // 관리자 15분, 일반 30분
    const activityEvents = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    let idleTimer = null;

    hasAutoLoggedOutRef.current = false;

    const logoutByInactivity = () => {
      if (hasAutoLoggedOutRef.current) return;
      hasAutoLoggedOutRef.current = true;

      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("displayName");
      localStorage.removeItem("nickname");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("idToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("kakaoId");
      localStorage.removeItem("loginType");
      window.dispatchEvent(new Event("auth:changed"));
      alert("오랫동안 활동이 없어 자동 로그아웃되었습니다.");
      navigate("/login");
    };

    const resetIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(logoutByInactivity, IDLE_TIMEOUT_MS);
    };

    resetIdleTimer();
    activityEvents.forEach((eventName) =>
      window.addEventListener(eventName, resetIdleTimer, { passive: true })
    );

    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      activityEvents.forEach((eventName) =>
        window.removeEventListener(eventName, resetIdleTimer)
      );
    };
  }, [location.pathname, navigate]);

  return (
    <div className="bg-[#EBEAF3] min-h-screen font-sans text-gray-900">
      {!isAuthPage && <Header colorType={headerState} onNavigate={handleNavigate} />}

      <Routes>
        <Route
          path="/"
          element={
            <>
              {!viewMode && <div className="h-28 md:h-0" />}
              {!viewMode && <MainVisual />}
              <div className="w-full transition-all duration-700 ease-in-out">
                {viewMode ? (
                  <div className="w-full min-h-screen flex flex-col">
                    {/* Header spacer */}
                    <div className="h-20 bg-[#EBEAF3]"></div>
                    {/* Purple section - 애니메이션으로 높이가 변함 */}
                    <div className={`bg-[#EBEAF3] transition-all duration-700 ease-out ${
                      isAnimating ? 'h-72' : 'h-16'
                    }`}></div>
                    {/* Content section with two-stage animation */}
                    <div className="bg-[#fafaf5] w-full rounded-tr-[5rem] flex-1 flex flex-col relative overflow-hidden">
                      <div
                        className={`w-full flex flex-col transition-all duration-700 ease-out relative z-10 ${
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
                        <div className="flex-1">
                          <div className="px-4 pt-10">
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
                          <div
                            className="overflow-hidden bg-[#fafaf5] shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.1)]"
                            style={{
                              marginTop: `${24 * footerRevealProgress}px`,
                              maxHeight: `${104 * footerRevealProgress}px`,
                              opacity: footerRevealProgress,
                              transform: `translateY(${16 * (1 - footerRevealProgress)}px)`,
                              pointerEvents: footerRevealProgress > 0 ? "auto" : "none",
                              transition:
                                "max-height 240ms ease-out, opacity 220ms ease-out, transform 280ms ease-out, margin-top 260ms ease-out",
                            }}
                          >
                            <Footer />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="transform">
                    <div className="bg-[#fafaf5] rounded-tr-[3rem] md:rounded-tr-[5rem] shadow-[0_4px_12px_rgba(0,0,0,0.2)] px-4 md:px-10 pt-24 md:pt-40 pb-10 md:pb-16 w-full relative overflow-visible">
                      <div className="absolute -top-10 md:-top-20 left-1/2 -translate-x-1/2 z-10 w-[95%] md:w-auto" ref={mainCardsRef}>
                        <MainCards onNavigate={handleNavigate} />
                      </div>
                      <ReviewSection onViewAll={() => handleNavigate("review")} />
                      <ListingTable onNavigate={handleNavigate} />
                    </div>
                    <InquirySection onNavigate={handleNavigate} />
                    <div ref={inquiryTriggerRef} className="h-[0px] invisible pointer-events-none" />
                  </div>
                )}
              </div>
            </>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
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
