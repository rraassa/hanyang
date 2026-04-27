import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "./ui/Card";
import { cn } from "../lib/utils";

export default function MainCards({ onNavigate }) {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(target);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const handleTransferorNavigate = () => {
    if (typeof onNavigate === "function") {
      onNavigate("transferor"); // 양도자 페이지로 이동
    } else {
      navigate("/transferor"); // fallback: 직접 라우팅
    }
  };

  const handleAcceptorNavigate = () => {
    if (typeof onNavigate === "function") {
      onNavigate("acceptor"); // 양수자 페이지로 이동
    } else {
      navigate("/acceptor"); // fallback: 직접 라우팅
    }
  };

  return (
    <section
      ref={sectionRef}
      className={cn(
        "flex justify-center items-start py-8 md:py-20 md:-mt-20 transition-all duration-700 ease-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      )}
    >
      <div className="relative flex w-full max-w-[920px] flex-col rounded-2xl bg-[#fafaf5] px-4 py-5 shadow-[0_10px_30px_rgba(0,0,0,0.2)] md:w-[900px] md:flex-row md:rounded-tr-[4rem] md:px-12 md:py-12 md:pb-6 overflow-visible z-0">
        {/* 파란 카드 - 양도 */}
        <Card
          className={cn(
            "bg-[#0E2A7B] text-white h-56 w-full rounded-2xl p-4 flex flex-col justify-between shadow-xl z-10 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer border-0 md:w-72 md:h-72 md:absolute md:-top-10 md:-left-6"
          )}
          onClick={handleTransferorNavigate}
        >
          <div className="text-left mt-2 mb-2 pl-1 md:mt-5 md:mb-5 md:pl-3">
            <p className="text-2xl md:text-3xl font-bold leading-tight mb-1">양도</p>
            <p className="text-base mt-1">차를 판매할 때</p>
          </div>
          <img
            src="/img/car_hand1.png"
            alt="양도 이미지"
            className="w-[48%] md:w-[70%] mx-auto object-contain -mt-2"
          />
        </Card>

        {/* 보라 카드 - 양수 */}
        <Card
          className={cn(
            "mt-4 bg-[#4C2E91] text-white h-56 w-full rounded-tl-2xl rounded-bl-2xl rounded-br-2xl p-4 rounded-tr-[4rem] flex flex-col justify-between shadow-xl z-20 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer border-0 md:mt-0 md:w-72 md:h-72 md:absolute md:-top-10 md:left-[18rem] md:rounded-tr-[4.5rem]"
          )}
          onClick={handleAcceptorNavigate}
        >
          <div className="text-left mt-2 mb-2 pl-1 md:mt-5 md:mb-5 md:pl-3">
            <p className="text-2xl md:text-3xl font-bold leading-tight mb-1">양수</p>
            <p className="text-base mt-1">차를 구매할 때</p>
          </div>
          <img
            src="/img/car_hand2.png"
            alt="양수 이미지"
            className="w-[48%] md:w-[70%] mx-auto object-contain -mt-2"
          />
        </Card>

        {/* 설명 카드 */}
        <div className="text-black w-full rounded-2xl px-2 pt-4 pb-0 flex flex-col items-start z-0 md:w-64 md:h-71 md:px-6 md:pt-2 md:ml-[34rem]">
          <div className="text-left w-full leading-snug mt-1 mb-1 md:mt-4" style={{ marginTop: "1rem" }}>
            <p className="text-base mb-1">믿고 맡기는</p>
            <p className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">
              한양상사 <span className="text-base font-normal text-black align-middle">입니다</span>
            </p>
          </div>
          <div className="mt-1">
            <img
              src="/img/car_main.png"
              alt="메인 이미지"
              className="w-[75%] md:w-[120%] object-contain relative left-0 md:left-4 top-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
