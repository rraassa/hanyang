import { useEffect, useState } from 'react';

const allReviews = [
  { id: 1, city: '서울', category: '택시', text: '차량을 구매했는데 너무 좋아요', car: '쏘나타', price: '1억 6000만원' },
  { id: 2, city: '서울', category: '택시', text: '친절한 상담 감사합니다', car: '아반떼', price: '9천만원' },
  { id: 3, city: '서울', category: '일반차', text: '딜러가 최고였어요', car: '그랜저', price: '1억 2천만원' },
  { id: 4, city: '서울', category: '일반차', text: '빠른 진행 감사합니다', car: '모닝', price: '6천만원' },
  { id: 5, city: '서울', category: '택시', text: '가격이 만족스러워요', car: 'K5', price: '1억' },
  { id: 6, city: '서울', category: '택시', text: '좋은 컨디션 차량이었어요', car: '쏘렌토', price: '1억 3천만원' },
  { id: 7, city: '서울', category: '일반차', text: '빠르게 구매했어요', car: '벤츠', price: '2억' },
  { id: 8, city: '서울', category: '일반차', text: '정말 만족합니다', car: 'BMW', price: '1억 8천만원' },
];

export default function SlidingReviewSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardWidth = 320;
  const visibleCount = 4;
  const maxIndex = allReviews.length - visibleCount;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [maxIndex]);

  return (
    <section className="bg-[#FAFAF5] mt-44 py-10 px-6 flex justify-center">
      <div className="w-[1280px] overflow-hidden">
        {/* 제목 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-black">구매 후기</h2>
          <a href="/review" className="text-sm text-gray-600 hover:underline">
            전체보기
          </a>
        </div>

        {/* 슬라이더 */}
        <div className="overflow-hidden w-full">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * cardWidth}px)`,
              width: `${allReviews.length * cardWidth}px`,
            }}
          >
            {allReviews.map((review) => (
              <div
                key={review.id}
                style={{ width: `${cardWidth}px` }}
                className="flex-shrink-0"
              >
                <div className="bg-[#FAFAF5] rounded-xl p-4 transition-shadow">
                  {/* ✅ Hover 시 확대되는 이미지 박스 */}
                  <div className="w-full h-40 bg-white rounded-lg mb-4 border border-gray-200 transform transition-transform duration-300 hover:scale-105" />

                  {/* 라벨 */}
                  <div className="text-xs text-white bg-[#0E2A7B] px-2 py-[2px] rounded-md inline-block mb-2">
                    {review.city} | 후기
                  </div>

                  {/* 텍스트 */}
                  <p className="text-sm text-black font-medium mb-1">{review.text}</p>
                  <p className="text-sm text-gray-700">{review.car} / {review.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
