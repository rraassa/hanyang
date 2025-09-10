import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ colorType, onNavigate }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lensVisible, setLensVisible] = useState(false);
  const [lensText, setLensText] = useState("");
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  const bgColor =
    colorType === "scrolled" ? "bg-[#EBEAF3]" : "bg-[#FCFCF9]";
  const textColor =
    colorType === "scrolled" ? "text-[#4C2E91]" : "text-[#0E2A7B]";

  // ✅ 메뉴 목록 + 상태명 매핑
  const menuItems = [
    { label: "양도자", mode: "transferor" },
    { label: "양수자", mode: "acceptor" },
    { label: "시세표", mode: "price" },
    { label: "문의하기", mode: "inquiry" },
    { label: "거래후기", mode: "review" },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 ${bgColor} shadow-md transition-colors duration-300`}>
      <div className="flex items-center justify-between px-10 py-5">
        <div className="flex items-center gap-10">
          <div className={`text-2xl font-bold ${textColor}`}>한양상사</div>

          <nav className="flex space-x-8 text-[15px] font-semibold">
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
        <div className={`flex space-x-2 text-sm font-normal whitespace-nowrap ${textColor}`}>
          {isLoggedIn ? (
            <>
              <span onClick={() => navigate("/mypage")} className="cursor-pointer hover:underline">마이페이지</span>
              <span>|</span>
              <span
                onClick={() => {
                  localStorage.removeItem("isLoggedIn");
                  navigate("/");
                  setTimeout(() => window.location.reload(), 10);
                }}
                className="cursor-pointer hover:underline"
              >
                로그아웃
              </span>
            </>
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
