export default function PriceView() {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(
    today.getDate()
  ).padStart(2, "0")}`;

  return (
    <section className="w-full px-4 pb-8 md:pb-10">
      <div className="mx-auto w-full max-w-[1220px] rounded-[10px] pt-4 md:pt-6">
        <h2 className="text-center text-2xl font-extrabold text-[#0E2A7B] tracking-tight md:text-3xl">개인택시 시세</h2>

        <div className="mx-auto mt-10 w-full max-w-[1040px] border border-[#E7E7E7] bg-[#fafaf5] px-6 py-16 shadow-[0_6px_20px_rgba(0,0,0,0.08)] md:mt-12 md:px-14 md:py-20">
          <div className="mx-auto w-fit">
            <p className="text-center text-2xl font-extrabold leading-tight text-black md:-ml-36 md:text-[32px]">
              {formattedDate} 현재 시세는
            </p>
            <p className="mt-5 text-center text-2xl font-extrabold leading-tight md:ml-36 md:text-[32px]">
              <span className="text-red-600">1억1천6백만원</span>
              <span className="text-black"> 입니다.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
