import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getKakaoChannelChatUrl } from "../lib/kakaoChannel";

export default function InquiryView() {
  const navigate = useNavigate();
  const kakaoChatUrl = getKakaoChannelChatUrl();
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

  useEffect(() => {
    if (!isLoggedIn) {
      alert("문의하기는 로그인 후 이용할 수 있습니다.");
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  return (
    <section className="w-full px-4 pb-8 md:pb-10">
      <div className="mx-auto w-full max-w-[1220px] rounded-[10px] pt-4 md:pt-6">
        <div className="mx-auto mt-10 mb-8 w-full max-w-[1040px] border border-[#E7E7E7] bg-[#fafaf5] px-6 py-16 shadow-[0_6px_20px_rgba(0,0,0,0.08)] md:mt-12 md:mb-10 md:px-14 md:py-20">
          <div className="mx-auto w-fit">
            <p className="text-center text-2xl font-extrabold leading-tight text-black md:text-[32px]">
              <span className="text-[#0E2A7B]">010-3736-8082</span>로 전화 문의 주시면
            </p>
            <p className="mt-2 text-center text-2xl font-extrabold leading-tight text-black md:text-[32px]">
              친절히 답해드리겠습니다
            </p>
          </div>
          <div className="mt-10 flex justify-center md:mt-12">
            <a
              href={kakaoChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FEE500] px-8 py-3.5 text-base font-bold text-[#191919] shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition hover:bg-[#FDD835] md:text-lg"
            >
              카카오톡으로 문의하기
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
