import { useEffect, useMemo, useState } from "react";
import { getAllReviews } from "../lib/reviewApi";

export default function SlidingReviewSection({ onViewAll }) {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(320);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const loadLatestReviews = async () => {
      try {
        const all = await getAllReviews();
        setReviews(all || []);
      } catch (error) {
        console.error("메인 거래 후기 로드 실패:", error);
        setReviews([]);
      }
    };

    loadLatestReviews();
  }, []);

  const latestReviews = useMemo(
    () =>
      [...reviews]
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        )
        .slice(0, 8),
    [reviews]
  );

  const maxIndex = Math.max(0, latestReviews.length - visibleCount);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 768) {
        setCardWidth(260);
        setVisibleCount(1);
      } else {
        setCardWidth(320);
        setVisibleCount(4);
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [latestReviews.length, visibleCount]);

  useEffect(() => {
    if (latestReviews.length <= visibleCount) return undefined;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [maxIndex, latestReviews.length, visibleCount]);

  return (
    <section className="bg-[#FAFAF5] mt-24 md:mt-44 py-10 px-4 md:px-6 flex justify-center">
      <div className="w-full max-w-[1280px] overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-black">거래 후기</h2>
          <button
            type="button"
            onClick={() => onViewAll?.()}
            className="text-sm text-gray-600 hover:underline"
          >
            전체보기
          </button>
        </div>

        <div className="overflow-hidden w-full">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * cardWidth}px)`,
              width: `${latestReviews.length * cardWidth}px`,
            }}
          >
            {latestReviews.map((review) => (
              <div
                key={review.reviewId || review.id}
                style={{ width: `${cardWidth}px` }}
                className="flex-shrink-0"
              >
                <div className="bg-[#FAFAF5] rounded-xl p-4 transition-shadow">
                  <div className="w-full h-40 rounded-lg mb-4 border border-gray-200 overflow-hidden transform transition-transform duration-300 hover:scale-105 bg-white">
                    {review.imageUrl ? (
                      <img
                        src={review.imageUrl}
                        alt="거래 후기 이미지"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-white" />
                    )}
                  </div>

                  <div className="text-xs text-white bg-[#0E2A7B] px-2 py-[2px] rounded-md inline-block mb-2">
                    {review.city || "서울"} | 후기
                  </div>

                  <p className="text-sm text-black font-semibold mb-1">{review.title}</p>
                  <p className="text-sm text-gray-700 line-clamp-1">
                    {review.content || "거래 후기가 등록되었습니다."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
