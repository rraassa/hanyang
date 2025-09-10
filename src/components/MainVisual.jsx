export default function MainHeroSection() {
  return (
    <section className="bg-[#EBEAF3] py-16 px-6">
      <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row items-center justify-between">
        {/* 왼쪽 텍스트 영역 */}
        <div className="flex-1 mb-10 lg:mb-0 flex items-center">
          <div>
            <p className="text-sm text-gray-600 mb-2">#차량양도 #판매 #차량등록 #구매</p>
            <h2
              className="text-2xl md:text-3xl font-bold text-gray-800 leading-loose"
            >
              차량 판매도, 구매도 고민이라면? <br />
              믿고 맡길 수 있는 <span className="text-[#0E2A7B]">한양상사</span>가 함께합니다.
            </h2>
          </div>
        </div>

        {/* 오른쪽 차량 이미지 */}
        <div className="flex-1 text-center">
          <img
            src="/img/car_hero.png"
            alt="메인 차량 이미지"
            className="w-[80%] mx-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}
