export default function InquirySection() {
  return (
    <section className="bg-[#f4f4fa] py-40 px-8 shadow-[0_10px_20px_rgba(0,0,0,1)]">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-16">
        
        {/* 왼쪽 텍스트 + 버튼 (약간 오른쪽으로 이동) */}
        <div className="flex-1 text-center md:text-left pl-24">
          <h2 className="text-5xl font-extrabold text-black mb-6">문의하기</h2>
          <p className="text-xl text-gray-700 mb-10">궁금한 점이 있으시면 언제든지 문의 주세요!</p>
          <div className="flex flex-col md:flex-row gap-6 justify-center md:justify-start">
            <button className="bg-[#0E2A7B] text-white text-lg px-8 py-4 rounded-xl shadow-xl hover:bg-[#0b235f] transition">
              내가 할 문의
            </button>
            <button className="border-2 border-black text-black text-lg px-8 py-4 rounded-xl hover:bg-gray-100 transition">
              문의 하기
            </button>
          </div>
        </div>

        {/* 오른쪽 전화기 이미지 */}
        <div className="flex-1 flex justify-center">
          <img
            src="/img/phone.png"
            alt="문의 전화기"
            className="w-[600px] h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}
