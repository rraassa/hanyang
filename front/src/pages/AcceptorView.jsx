import { useEffect, useRef, useState } from "react";

const TAB_PROCEDURE = "procedure";
const TAB_REQUIREMENTS = "requirements";

const requirementItems = [
  {
    title: "자격조건",
    details: [
      "무사고 택시 운전 경력 3년 이상(군경 경력 포함) 6개월 내 택시 운전 경력 3개월 이상 가능",
      "개인택시 자격 취득자는 시험 생략으로 가능함",
      "개인택시 양수전 교육은 선분실 이후 5일 내에 차량 및 양수양도 관련 절차 이수 필요",
    ],
  },
  {
    title: "택시자격증 취득",
    details: [
      "서울: 자격시험 오전 21, 오후 22번",
      "서울도시공사: 접수 오전 4번",
      "문제는 필기식(총 80점)",
    ],
    notice: "운전적성정밀검사 받은 후 진행합니다. ※ 준비물은 본인 소유 차량 및 자격증 추천함",
  },
  {
    title: "교통안전교육",
    details: [
      "교통안전교육장 예약 후 교육일자 4시간 이수",
      "경남/경북 선택 가능",
      "양도는 동부지원/서부지원 둘 중 한곳으로 접수",
    ],
  },
  {
    title: "서울시강조운송교육센터",
    details: [
      "시청동 개인택시 신규 교육 2시간 수료",
      "3년 이내 법규 위반자 있을 시 보수교육 등",
      "매월 2회 교육 있으니 접수 권장함",
    ],
  },
];

export default function AcceptorView() {
  const [activeTab, setActiveTab] = useState(TAB_PROCEDURE);
  const isProcedure = activeTab === TAB_PROCEDURE;
  const searchTargetText = isProcedure ? "양수 절차& 구비 서류" : "양수 요건";
  const [searchTypingIndex, setSearchTypingIndex] = useState(0);
  const [isDeletingSearchText, setIsDeletingSearchText] = useState(false);
  const [revealStep, setRevealStep] = useState(0);
  const revealStartYRef = useRef(0);

  useEffect(() => {
    setSearchTypingIndex(0);
    setIsDeletingSearchText(false);
  }, [searchTargetText]);

  useEffect(() => {
    let delay = isDeletingSearchText ? 130 : 200;

    if (!isDeletingSearchText && searchTypingIndex === searchTargetText.length) {
      delay = 1600;
    } else if (isDeletingSearchText && searchTypingIndex === 0) {
      delay = 550;
    }

    const timer = setTimeout(() => {
      if (!isDeletingSearchText) {
        if (searchTypingIndex < searchTargetText.length) {
          setSearchTypingIndex((prev) => prev + 1);
        } else {
          setIsDeletingSearchText(true);
        }
      } else if (searchTypingIndex > 0) {
        setSearchTypingIndex((prev) => prev - 1);
      } else {
        setIsDeletingSearchText(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [isDeletingSearchText, searchTypingIndex, searchTargetText]);

  useEffect(() => {
    revealStartYRef.current = window.scrollY;
    setRevealStep(0);

    const handleRevealScroll = () => {
      const delta = Math.max(0, window.scrollY - revealStartYRef.current);
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const vh = window.innerHeight || 900;
      const step1 = Math.max(36, vh * 0.06);
      const step2 = Math.max(115, vh * 0.17);
      const step3 = Math.max(195, vh * 0.28);
      let nextStep = 0;

      if (delta > step1) nextStep = 1;
      if (delta > step2) nextStep = 2;
      if (delta > step3) nextStep = 3;

      if (!isProcedure) {
        if (delta > step3 + 70) nextStep = 4;
        if (delta > step3 + 140) nextStep = 5;
      } else {
        if (delta > step3 + 70) nextStep = 4;
        if (delta > step3 + 140) nextStep = 5;
        if (delta > step3 + 210) nextStep = 6;
        if (delta > step3 + 280) nextStep = 7;
      }

      if (atBottom) {
        nextStep = isProcedure ? 7 : 5;
      }

      setRevealStep(nextStep);
    };

    handleRevealScroll();
    window.addEventListener("scroll", handleRevealScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleRevealScroll);
  }, [isProcedure]);

  return (
    <section className="w-full px-4 pb-8 md:pb-10">
      <div className="mx-auto w-full max-w-[1080px] rounded-[10px] pt-4 md:pt-6">
        <h2 className="text-center text-2xl font-extrabold text-[#0E2A7B] tracking-tight md:text-3xl">
          양수자[구매자]
        </h2>

        <div className="mt-7 flex items-center justify-center gap-6 md:mt-10 md:gap-10">
          <button
            type="button"
            onClick={() => setActiveTab(TAB_PROCEDURE)}
            className={`w-40 rounded-xl py-3 text-base font-bold transition-all duration-200 md:w-52 md:py-3.5 md:text-lg ${
              isProcedure
                ? "bg-[#0E2A7B] text-white shadow-[0_8px_18px_rgba(14,42,123,0.35)]"
                : "bg-white text-[#0E2A7B] shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
            }`}
          >
            양수 절차& 구비 서류
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(TAB_REQUIREMENTS)}
            className={`w-40 rounded-xl py-3 text-base font-bold transition-all duration-200 md:w-52 md:py-3.5 md:text-lg ${
              !isProcedure
                ? "bg-[#0E2A7B] text-white shadow-[0_8px_18px_rgba(14,42,123,0.35)]"
                : "bg-white text-[#0E2A7B] shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
            }`}
          >
            양수 요건
          </button>
        </div>

        <div className="mt-8 bg-[#fafaf5] px-5 py-7 shadow-[0_6px_20px_rgba(0,0,0,0.08)] md:mt-10 md:px-14 md:py-12">
          <div className="mx-auto flex w-full max-w-[760px] items-center gap-2 rounded-full bg-white px-5 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.12)] md:gap-3 md:px-6 md:py-3.5">
            <svg
              className="h-6 w-6 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M11 18C14.866 18 18 14.866 18 11C18 7.13401 14.866 4 11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path d="M20 20L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p className="text-xl font-bold text-black md:text-2xl">
              {searchTargetText.slice(0, searchTypingIndex)}
              <span className="ml-0.5 inline-block animate-pulse text-black">|</span>
            </p>
          </div>

          <div className="mx-auto mt-8 w-full max-w-[900px] text-left md:mt-12">
            <h3
              className={`text-2xl font-extrabold text-black transition-all duration-500 ease-out md:text-[32px] ${
                revealStep < 1 ? "translate-y-5 opacity-0" : "translate-y-0 opacity-100"
              }`}
            >
              {isProcedure ? "간단한 양수 절차& 구비 서류" : "간단한 매수 요건"}
            </h3>

            {isProcedure ? (
              <ul className="mt-7 list-disc space-y-4 pl-8 text-base font-semibold text-black md:mt-10 md:text-[20px]">
                <li
                  className={`transition-all duration-500 ease-out ${
                    revealStep < 2 ? "translate-y-5 opacity-0" : "translate-y-0 opacity-100"
                  }`}
                >
                  <p className="font-semibold">자격증 갖추고 5년 경력으로 서울 개인택시 양수시 진행절차</p>
                  <p
                    className={`mt-2 text-base font-medium leading-relaxed text-black/80 transition-all duration-500 ease-out md:text-[20px] ${
                      revealStep < 3 ? "translate-y-5 opacity-0" : "translate-y-0 opacity-100"
                    }`}
                  >
                    양도 양수 허가신청서부터 제출하여 처리가 5일 이내 끝나면서 무사고로 운전한 경우에
                    모든 계약 후 신규 개인택시 교육 후 종결 단계(인가증) 취득 후 즉시 운행이
                    순차적으로 진행됩니다.
                  </p>
                </li>
              </ul>

              <div
                className={`mt-12 text-black transition-all duration-500 ease-out ${
                  revealStep < 3 ? "translate-y-5 opacity-0" : "translate-y-0 opacity-100"
                }`}
              >
                <p
                  className={`text-2xl font-extrabold leading-tight transition-all duration-500 ease-out md:text-[32px] ${
                    revealStep < 3 ? "translate-y-5 opacity-0" : "translate-y-0 opacity-100"
                  }`}
                >
                  개인택시 매수인 구비서류
                </p>

                <div
                  className={`mt-6 space-y-5 text-base leading-relaxed transition-all duration-500 ease-out md:text-[20px] ${
                    revealStep < 3 ? "translate-y-5 opacity-0" : "translate-y-0 opacity-100"
                  }`}
                >
                  <div
                    className={`transition-all duration-500 ease-out ${
                      revealStep < 4 ? "translate-y-5 opacity-0" : "translate-y-0 opacity-100"
                    }`}
                  >
                    <p className="font-extrabold">※ 영업용 경력 구비서류</p>
                    <p>경력증명서 서식 (전국교통과학원 택시조합에서 검증)</p>
                    <p>회사 법인 인감증명서 (유효기간 3개월)</p>
                    <p>운전경력증명서 (또는 소속된 근로원천징수 3년이상 발급)</p>
                    <p>경력관리대장 (원천대조필) 법인택시 6년이상 / 3년이상 2년6월 이상 근무</p>
                    <p>운전적성정밀검사 (원천대조필 - 퇴직일자 기재요망)</p>
                  </div>

                  <div
                    className={`transition-all duration-500 ease-out ${
                      revealStep < 5 ? "translate-y-5 opacity-0" : "translate-y-0 opacity-100"
                    }`}
                  >
                    <p className="font-extrabold">※ 법인 자가용 경력 구비서류</p>
                    <p>경력증명서 서식 (전국교통과학원 택시조합에서 검증)</p>
                    <p>회사 법인 인감증명서</p>
                    <p>근로계약서 (6년이상 회사서 법인인감 날인)</p>
                    <p>인사기록카드 (복사해서 법인 인감 날인)</p>
                    <p>*버스(관광차) 7년에 6년</p>
                    <p>운행일지 또는 상응하는 대체서류</p>
                  </div>

                  <div
                    className={`transition-all duration-500 ease-out ${
                      revealStep < 6 ? "translate-y-5 opacity-0" : "translate-y-0 opacity-100"
                    }`}
                  >
                    <p className="font-extrabold">※ 개별용달 화물경력 구비서류</p>
                    <p>경력증명서 (개별용달 협회 발행, 개별화물 가산점 협회 발행)</p>
                    <p>경력증명서 발급대장 사본 (협회발행)</p>
                    <p>부가가치세 과세표준증명 (관할 세무서 최근 3년 발행)</p>
                    <p>국민건강보험 자격득실 확인서 (지역 의료보험 공단으로부터 발행)</p>
                  </div>

                  <div
                    className={`transition-all duration-500 ease-out ${
                      revealStep < 7 ? "translate-y-5 opacity-0" : "translate-y-0 opacity-100"
                    }`}
                  >
                    <p className="font-extrabold">※ 공동 구비서류 (추가경력 관계서류)</p>
                    <p>1. 운전경력 무사고 증명서 경찰서 (교통사고 전체 경력 발급)</p>
                    <p>(연하취득일로부터 현재까지) 경찰서 민원실 발급, 유효기간 1개월</p>
                    <p>2. 운전정밀검사 판정표 (성산동 서부검사장 T. 375-1273 하계동 검사장)</p>
                    <p>(운전종종 실시로 이상자는 특별검사, 신규검사 받으셔야합니다.)</p>
                    <p>무사고 운전자 재발급 수수료 1장 1,000원 성산, 노원, 강남, 구로, 성동검사장에서 받으시면 됩니다</p>
                    <p>3. 운전면허증 사본 1통</p>
                    <p>4. 택시운전자격증 사본 1통</p>
                    <p>5. 기본증명서 1통 (구 호적초본) (상세)</p>
                    <p>6. 인감증명 2통 (6,7,8,9번 동사무소 발행)</p>
                    <p>7. 주민등록등본 1통</p>
                    <p>8. 주민등록초본 1통 (처음부터 발급)</p>
                    <p>9. 사진 (명함판사진 10매) 인가후 개인택시 사진표 제작시 필요함</p>
                    <p>10. 인감도장 지참</p>
                    <p>11. 운전 종사자교육 수료증 (사업용 교통문화 교육원)</p>
                    <p>12. 택시 양수교육 수료증 (성남, 상주 택시양수교육센터)</p>
                  </div>
                </div>
              </div>
            ) : (
              <ol className="mt-7 list-decimal space-y-5 pl-8 text-base leading-relaxed text-black md:mt-10 md:pl-10 md:text-[20px]">
                {requirementItems.map((item, index) => (
                  <li
                    key={item.title}
                    className={`transition-all duration-500 ease-out ${
                      revealStep < index + 2 ? "translate-y-5 opacity-0" : "translate-y-0 opacity-100"
                    }`}
                  >
                    <p className="font-extrabold text-black">{item.title}</p>
                    <ul className="mt-1 list-disc space-y-0.5 pl-5 font-normal text-black/90">
                      {item.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                    {item.notice && <p className="mt-2 font-semibold text-red-600">* {item.notice}</p>}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
