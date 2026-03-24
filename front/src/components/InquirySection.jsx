export default function InquirySection() {
  return (
    <section className="bg-[#f4f4fa] py-20 md:py-48 px-4 md:px-8 relative">
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-gray-300/40 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-300/40 to-transparent pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
        
        {/* 왼쪽 텍스트 + 버튼 (약간 오른쪽으로 이동) */}
        <div className="flex-1 text-center md:text-left pl-0 md:pl-24">
          <h2 className="text-3xl md:text-5xl font-extrabold text-black mb-4 md:mb-6">문의하기</h2>
          <p className="text-base md:text-xl text-gray-700 mb-7 md:mb-10">궁금한 점이 있으시면 언제든지 문의 주세요!</p>
          <div className="flex flex-col md:flex-row gap-6 justify-center md:justify-start">
            <button className="bg-[#0E2A7B] text-white text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-xl hover:bg-[#0b235f] transition">
              내가 할 문의
            </button>
            <button className="border-2 border-black text-black text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-xl hover:bg-gray-100 transition">
              문의 하기
            </button>
          </div>
        </div>

        {/* 오른쪽 전화기 이미지 */}
        <div className="flex-1 flex justify-center">
          <img
            src="/img/phone.png"
            alt="문의 전화기"
            className="w-full max-w-[420px] md:max-w-[600px] h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}
