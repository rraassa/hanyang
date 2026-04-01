import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ colorType, onNavigate }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lensVisible, setLensVisible] = useState(false);
  const [lensText, setLensText] = useState("");
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const syncAuthState = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      setDisplayName(localStorage.getItem("displayName") || localStorage.getItem("nickname") || "");
    };

    syncAuthState();
    window.addEventListener("storage", syncAuthState);
    window.addEventListener("auth:changed", syncAuthState);
    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("auth:changed", syncAuthState);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const bgColor =
    colorType === "scrolled" ? "bg-[#EBEAF3]" : "bg-[#FCFCF9]";
  const textColor =
    colorType === "scrolled" ? "text-[#4C2E91]" : "text-[#0E2A7B]";

  // ✅ 메뉴 목록 + 상태명 매핑
  const menuItems = [
    { label: "양도자", mode: "transferor" },
    { label: "양수자", mode: "acceptor" },
    { label: "개인택시 시세", mode: "price" },
    { label: "문의하기", mode: "inquiry" },
    { label: "거래후기", mode: "review" },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 ${bgColor} shadow-md transition-colors duration-300`}>
      <div className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-10 md:py-5">
        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center md:gap-10">
          <div 
            className={`text-xl md:text-2xl font-bold ${textColor} cursor-pointer hover:opacity-80 transition-opacity duration-200`}
            onClick={() => onNavigate("home")}
          >
            한양상사
          </div>

          <nav className="scrollbar-hide flex gap-4 overflow-x-auto whitespace-nowrap text-xs font-semibold md:space-x-8 md:gap-0 md:text-[15px]">
            {menuItems.map(({ label, mode }, idx) => (
              <span
                key={idx}
                onClick={() => onNavigate(mode)} // ✅ 클릭 시 상태 변경
                onMouseEnter={() => {
                  setLensVisible(true);
                  setLensText(label);
                }}
                onMouseLeave={() => setLensVisible(false)}
                onMouseMove={(e) =>
                  setLensPos({ x: e.clientX - 40, y: e.clientY + 40 })
                }
                className={`transition-all duration-300 hover:underline cursor-pointer ${textColor}`}
              >
                {label}
              </span>
            ))}
          </nav>
        </div>

        {/* 로그인/로그아웃 영역 */}
        <div className={`ml-auto flex space-x-2 text-xs font-normal whitespace-nowrap md:text-sm ${textColor}`}>
          {isLoggedIn ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="flex h-7 w-7 items-center justify-center rounded-full border-[2px] border-black bg-[#17368F] text-base font-extrabold text-white md:h-8 md:w-8 md:text-lg"
                aria-label="프로필 메뉴 열기"
              >
                {(displayName || "L").charAt(0).toUpperCase()}
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-28 overflow-hidden rounded-xl border border-gray-200 bg-[#fafaf5] text-black shadow-[0_8px_18px_rgba(0,0,0,0.2)]">
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate?.("review");
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-xs font-semibold md:text-[15px] hover:bg-[#f0efe8]"
                  >
                    나의 후기
                  </button>
                  <div className="h-px bg-gray-200" />
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem("isLoggedIn");
                      localStorage.removeItem("displayName");
                      localStorage.removeItem("nickname");
                      localStorage.removeItem("isAdmin");
                      window.dispatchEvent(new Event("auth:changed"));
                      navigate("/");
                    }}
                    className="w-full px-3 py-2 text-xs font-semibold md:text-[15px] hover:bg-[#f0efe8]"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <span onClick={() => navigate("/login")} className="cursor-pointer hover:underline">로그인</span>
              <span>|</span>
              <span onClick={() => navigate("/signup")} className="cursor-pointer hover:underline">회원가입</span>
            </>
          )}
        </div>
      </div>

      {/* 렌즈 효과 */}
      {lensVisible && (
        <div
          className="pointer-events-none fixed w-24 h-24 rounded-full bg-white border-2 border-[#0E2A7B] shadow-md flex items-center justify-center font-bold text-xl"
          style={{
            top: lensPos.y,
            left: lensPos.x,
            transform: "translate(-50%, -50%) scale(1.2)",
            transition: "transform 0.1s ease",
            zIndex: 9999,
            color: "#0E2A7B",
          }}
        >
          {lensText}
        </div>
      )}
    </header>
  );
}
