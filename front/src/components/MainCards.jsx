import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "./ui/Card";
import { cn } from "../lib/utils";

export default function MainCards({ onNavigate }) {
  const navigate = useNavigate();

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
    <section className="flex justify-center items-start py-20 -mt-20">
      <div className="relative flex rounded-2xl rounded-tr-[4rem] bg-[#fafaf5] shadow-[0_10px_30px_rgba(0,0,0,0.2)] px-12 py-12 pb-6 w-[900px] overflow-visible z-0">
        {/* 파란 카드 - 양도 */}
        <Card
          className={cn(
            "bg-[#0E2A7B] text-white w-72 h-72 rounded-2xl p-4 flex flex-col justify-between absolute -top-10 -left-6 shadow-xl z-10 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer border-0"
          )}
          onClick={handleTransferorNavigate}
        >
          <div className="text-left mt-5 mb-5 pl-3">
            <p className="text-3xl font-bold leading-tight mb-1">양도</p>
            <p className="text-base mt-1">차를 판매할 때</p>
          </div>
          <img
            src="/img/car_hand1.png"
            alt="양도 이미지"
            className="w-[70%] mx-auto object-contain -mt-2"
          />
        </Card>

        {/* 보라 카드 - 양수 */}
        <Card
          className={cn(
            "bg-[#4C2E91] text-white w-72 h-72 rounded-tl-2xl rounded-bl-2xl rounded-br-2xl p-4 rounded-tr-[4.5rem] flex flex-col justify-between absolute -top-10 left-[18rem] shadow-xl z-20 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer border-0"
          )}
          onClick={handleAcceptorNavigate}
        >
          <div className="text-left mt-5 mb-5 pl-3">
            <p className="text-3xl font-bold leading-tight mb-1">양수</p>
            <p className="text-base mt-1">차를 구매할 때</p>
          </div>
          <img
            src="/img/car_hand2.png"
            alt="양수 이미지"
            className="w-[70%] mx-auto object-contain -mt-2"
          />
        </Card>

        {/* 설명 카드 */}
        <div className="text-black w-64 h-71 rounded-2xl px-6 pt-2 pb-0 flex flex-col items-start ml-[34rem] z-0">
          <div className="text-left w-full leading-snug mt-4 mb-1" style={{ marginTop: "1rem" }}>
            <p className="text-base mb-1">믿고 맡기는</p>
            <p className="text-3xl font-bold text-[#1A1A1A] mb-2">
              한양상사 <span className="text-base font-normal text-black align-middle">입니다</span>
            </p>
          </div>
          <div className="mt-1">
            <img
              src="/img/car_main.png"
              alt="메인 이미지"
              className="w-[120%] object-contain relative left-4 top-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
