import { useEffect, useState } from "react";

const TAB_PROCEDURE = "procedure";
const TAB_DOCUMENTS = "documents";

const procedureItems = [
  {
    title: "직거래 방식",
    description: "양수자와 양도자 원하는 금액 따라 후 계약금 정도금 받고 나머지 받는 방식",
  },
  {
    title: "일시불 방식",
    description: "원시불 매입으로 금액책정 없이(통상 기존 금액에서 -100만원 차감)",
  },
];

const documentItems = [
  "자동차등록증",
  "운전면허중원본",
  "택시자격증명(차량 내부 사진포함)",
  "인감2통(용도 기재x)",
  "운송사업면허증",
  "인감도장",
  "자동차매도용인감(자동차 판매 시)",
  "사업자등록증사본",
];

export default function TransferorView() {
  const [activeTab, setActiveTab] = useState(TAB_PROCEDURE);

  const isProcedure = activeTab === TAB_PROCEDURE;
  const searchTargetText = isProcedure ? "매도 절차" : "매도 서류";
  const [searchTypingIndex, setSearchTypingIndex] = useState(0);
  const [isDeletingSearchText, setIsDeletingSearchText] = useState(false);

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

  return (
    <section className="w-full px-4 pb-8 md:pb-10">
      <div className="mx-auto w-full max-w-[1080px] rounded-[10px] pt-4 md:pt-6">
        <h2 className="text-center text-2xl font-extrabold text-[#0E2A7B] tracking-tight md:text-3xl">
          양도자[판매자]
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
            매도 절차
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(TAB_DOCUMENTS)}
            className={`w-40 rounded-xl py-3 text-base font-bold transition-all duration-200 md:w-52 md:py-3.5 md:text-lg ${
              !isProcedure
                ? "bg-[#0E2A7B] text-white shadow-[0_8px_18px_rgba(14,42,123,0.35)]"
                : "bg-white text-[#0E2A7B] shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
            }`}
          >
            매도 서류
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
            <h3 className="text-2xl font-extrabold text-black md:text-[32px]">
              {isProcedure ? "간단한 매도 절차" : "간단한 매도 서류"}
            </h3>

            {isProcedure ? (
              <div className="mt-7 md:mt-10">
                <ol className="space-y-7 pl-4 md:space-y-9 md:pl-8">
                  {procedureItems.map((item, index) => (
                    <li
                      key={item.title}
                      className="text-black"
                    >
                      <p className="text-base font-extrabold leading-tight md:text-[20px]">
                        {index + 1}. {item.title}
                      </p>
                      <p className="mt-2 text-base font-normal leading-relaxed md:mt-3 md:text-[20px]">
                        {item.description}
                      </p>
                    </li>
                  ))}
                </ol>

              </div>
            ) : (
              <ol className="mt-7 list-decimal space-y-3 pl-8 text-base font-bold leading-snug text-black md:mt-10 md:space-y-4 md:pl-10 md:text-[20px]">
                {documentItems.map((item) => (
                  <li key={item}>
                    {item}
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
