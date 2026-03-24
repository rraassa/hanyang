import { useMemo, useState } from "react";
import { reviews } from "../data/reviews";

const TAB_ALL = "all";
const TAB_MINE = "mine";
const PAGE_SIZE = 12;

export default function ReviewView() {
  const [activeTab, setActiveTab] = useState(TAB_ALL);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredReviews = useMemo(() => {
    if (activeTab === TAB_MINE) return reviews.filter((review) => review.mine);
    return reviews;
  }, [activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedReviews = filteredReviews.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <section className="w-full px-4 pb-8 md:pb-10">
      <div className="mx-auto w-full max-w-[1220px] rounded-[10px] pt-4 md:pt-6">
        <h2 className="text-center text-2xl font-extrabold text-[#0E2A7B] tracking-tight md:text-3xl">거래 후기</h2>

        <div className="mt-7 flex items-center justify-center gap-6 md:mt-10 md:gap-10">
          <button
            type="button"
            onClick={() => handleTabChange(TAB_ALL)}
            className={`w-40 rounded-xl py-3 text-base font-bold transition-all duration-200 md:w-52 md:py-3.5 md:text-lg ${
              activeTab === TAB_ALL
                ? "bg-[#0E2A7B] text-white shadow-[0_8px_18px_rgba(14,42,123,0.35)]"
                : "bg-white text-[#0E2A7B] shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
            }`}
          >
            모든 후기
          </button>
          <button
            type="button"
            onClick={() => handleTabChange(TAB_MINE)}
            className={`w-40 rounded-xl py-3 text-base font-bold transition-all duration-200 md:w-52 md:py-3.5 md:text-lg ${
              activeTab === TAB_MINE
                ? "bg-[#0E2A7B] text-white shadow-[0_8px_18px_rgba(14,42,123,0.35)]"
                : "bg-white text-[#0E2A7B] shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
            }`}
          >
            내 후기
          </button>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pagedReviews.map((review) => (
            <article key={review.id} className="group">
              <div className="h-36 w-full rounded-md bg-white shadow-[0_4px_10px_rgba(0,0,0,0.08)] transition-transform duration-300 group-hover:translate-y-[-2px]" />
              <div className="mt-3">
                <span className="inline-block rounded bg-[#0E2A7B] px-2 py-0.5 text-[11px] font-semibold text-white">
                  {review.city} | {review.type}
                </span>
                <p className="mt-1 text-sm font-semibold text-black">{review.title}</p>
                <p className="text-xs text-gray-600">
                  차종: {review.car} / 가격: {review.price}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNumber) => {
            const active = pageNumber === safePage;
            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setCurrentPage(pageNumber)}
                className={`h-7 min-w-7 border border-[#0E2A7B] px-1.5 text-sm font-semibold ${
                  active ? "bg-[#0E2A7B] text-white" : "bg-white text-[#0E2A7B]"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
