import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { reviews } from "../data/reviews";

const TAB_ALL = "all";
const TAB_MINE = "mine";
const PAGE_SIZE = 12;

export default function ReviewView() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TAB_ALL);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewList, setReviewList] = useState(reviews);
  const [isWritePageOpen, setIsWritePageOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [attachedFileName, setAttachedFileName] = useState("");

  const filteredReviews = useMemo(() => {
    if (activeTab === TAB_MINE) return reviewList.filter((review) => review.mine);
    return reviewList;
  }, [activeTab, reviewList]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedReviews = filteredReviews.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleTabChange = (tab) => {
    if (tab === TAB_MINE && localStorage.getItem("isLoggedIn") !== "true") {
      alert("내 후기는 로그인 후 확인할 수 있습니다.");
      navigate("/login");
      return;
    }

    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleCreateReview = () => {
    const trimmedTitle = draftTitle.trim();
    const trimmedContent = draftContent.trim();

    if (!trimmedTitle || !trimmedContent) {
      alert("제목과 내용을 모두 입력해 주세요.");
      return;
    }

    const nextId = reviewList.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;
    const newReview = {
      id: nextId,
      city: "서울",
      type: "후기",
      title: trimmedTitle,
      car: "작성자 후기",
      price: "미입력",
      mine: true,
      content: trimmedContent,
    };

    setReviewList((prev) => [newReview, ...prev]);
    setActiveTab(TAB_MINE);
    setCurrentPage(1);
    setDraftTitle("");
    setDraftContent("");
    setAttachedFileName("");
    setIsWritePageOpen(false);
  };

  const handleOpenWritePage = () => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      alert("후기 작성은 로그인 후 이용할 수 있습니다.");
      navigate("/login");
      return;
    }

    setIsWritePageOpen(true);
  };

  useEffect(() => {
    const handleAppNavigate = (event) => {
      if (event.detail?.mode === "review") {
        setIsWritePageOpen(false);
      }
    };

    window.addEventListener("app:navigate", handleAppNavigate);
    return () => window.removeEventListener("app:navigate", handleAppNavigate);
  }, []);

  if (isWritePageOpen) {
    return (
      <section className="w-full px-4 pb-8 md:pb-10">
        <div className="mx-auto mt-6 w-full max-w-[1220px] rounded border border-[#e5e5e5] bg-[#fafaf5] px-6 py-8 shadow-[0_6px_16px_rgba(0,0,0,0.08)] md:px-12 md:py-10">
          <label className="block text-2xl font-bold text-black">제목</label>
          <input
            type="text"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            placeholder="제목을 입력해 주세요."
            className="mt-3 h-12 w-full rounded-xl border border-[#efefef] bg-white px-4 text-base outline-none shadow-[0_4px_10px_rgba(0,0,0,0.06)] focus:border-[#0E2A7B]"
          />

          <div className="mt-8 flex items-center justify-between">
            <label className="block text-2xl font-bold text-black">내용</label>
          </div>
          <textarea
            value={draftContent}
            onChange={(e) => setDraftContent(e.target.value)}
            placeholder="후기 내용을 입력해 주세요."
            className="mt-3 min-h-[320px] w-full resize-y rounded-xl border border-[#efefef] bg-white p-4 text-base outline-none shadow-[0_4px_10px_rgba(0,0,0,0.06)] focus:border-[#0E2A7B]"
          />

          <div className="mt-6 flex items-center justify-between">
            <label className="inline-flex h-10 min-w-24 cursor-pointer items-center justify-center rounded-full bg-white px-4 text-sm font-bold text-black shadow-[0_4px_10px_rgba(0,0,0,0.2)] transition-colors duration-200 hover:bg-[#f4f4f4]">
              첨부파일
              <input
                type="file"
                className="hidden"
                onChange={(e) => setAttachedFileName(e.target.files?.[0]?.name || "")}
              />
            </label>
            <button
              type="button"
              onClick={handleCreateReview}
              className="h-10 min-w-20 rounded-full bg-white px-4 text-sm font-bold text-black shadow-[0_4px_10px_rgba(0,0,0,0.2)] transition-colors duration-200 hover:bg-[#f4f4f4]"
            >
              완료
            </button>
          </div>
          {attachedFileName && (
            <p className="mt-2 text-right text-xs text-gray-600">첨부됨: {attachedFileName}</p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-4 pb-8 md:pb-10">
      <div className="mx-auto w-full max-w-[1220px] rounded-[10px] pt-4 md:pt-6">
        <h2 className="text-center text-2xl font-extrabold text-[#0E2A7B] tracking-tight md:text-3xl">거래 후기</h2>

        <div className="mt-7 md:mt-10">
          <div className="flex items-center justify-center gap-6 md:gap-10">
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
        </div>

        <div className="mt-10 flex justify-center md:justify-end">
          <button
            type="button"
            onClick={handleOpenWritePage}
            className="h-9 w-20 rounded-lg bg-white text-xs font-semibold text-[#0E2A7B] shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-colors duration-200 hover:bg-[#f6f6f6] md:h-10 md:w-24 md:text-sm"
          >
            후기 작성
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:mt-12">
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
