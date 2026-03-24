export default function ListingBox() {
  const listings = [
    { date: "2025.07.03", model: "소나타", location: "경기", status: "구매가능" },
    { date: "2025.07.03", model: "K5", location: "서울", status: "구매가능" },
    { date: "2025.07.03", model: "쏘렌토", location: "서울", status: "판매완료" },
    { date: "2025.07.03", model: "GV80", location: "제주", status: "구매가능" },
    { date: "2025.07.02", model: "K9", location: "부산", status: "판매완료" },
    { date: "2025.07.02", model: "QM6", location: "대전", status: "구매가능" },
    { date: "2025.07.02", model: "카니발", location: "광주", status: "판매완료" },
    { date: "2025.07.01", model: "아이오닉5", location: "인천", status: "구매가능" },
    { date: "2025.07.01", model: "모닝", location: "서울", status: "판매완료" },
    { date: "2025.07.01", model: "K3", location: "경기", status: "구매가능" },
    { date: "2025.07.01", model: "GV70", location: "서울", status: "판매완료" },
    { date: "2025.06.30", model: "투싼", location: "대구", status: "구매가능" },
    { date: "2025.06.30", model: "스타리아", location: "강원", status: "판매완료" },
    { date: "2025.06.30", model: "레이", location: "울산", status: "구매가능" },
    { date: "2025.06.30", model: "베뉴", location: "경남", status: "판매완료" },
  ];

  return (
    <section className="mt-20 w-full px-20 py-6 bg-[#fafaf5]">
      <h2 className="text-xl font-bold mb-4 text-[#0E2A7B]">매물 목록</h2>

      {/* 매물 리스트 전체를 감싸는 흰색 박스 */}
      <div className="rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-2">
        {/* 리스트 내용 스크롤 영역 */}
        <div className="max-h-[450px] overflow-y-auto scrollbar-hide divide-y divide-gray-200">
          {listings.map((item, idx) => {
            const isAvailable = item.status === "구매가능";
            return (
              <div
                key={idx}
                className="group px-4 py-5 w-full flex justify-between items-center min-h-[100px] bg-white"
              >
                {/* 왼쪽 정보 */}
                <div className="flex flex-row items-center gap-6 w-full">
                  <p className="text-base text-gray-500 group-hover:scale-105 transition-transform duration-300">
                    {item.date}
                  </p>
                  <p className="text-xl font-bold text-[#0E2A7B] group-hover:scale-110 transition-transform duration-300">
                    {item.model}
                  </p>
                  <p className="text-base text-gray-600 group-hover:scale-105 transition-transform duration-300">
                    {item.location}
                  </p>
                </div>

                {/* 상태 텍스트 */}
                <div className="min-w-[100px] text-right">
                  <p
                    className={`text-base font-semibold transition duration-300 group-hover:scale-110 ${
                      isAvailable
                        ? "text-blue-600 group-hover:drop-shadow-[0_0_4px_rgba(59,130,246,0.8)]"
                        : "text-red-500 group-hover:drop-shadow-[0_0_4px_rgba(239,68,68,0.8)]"
                    }`}
                  >
                    {item.status}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
