/** 서브페이지 스크롤 reveal 애니메이션용(실제 푸터 높이에 맞춤) */
export const FOOTER_BLOCK_MIN_HEIGHT_PX = 88;

export default function Footer() {
  return (
    <footer className="flex w-full shrink-0 flex-col items-center justify-center gap-0.5 bg-[#fafaf5] px-4 py-4 text-center text-sm leading-snug text-gray-500 shadow-[0_-2px_20px_rgba(0,0,0,0.1)]">
      <p className="max-w-full">한양상사 | 서울특별시 관악구 봉천로 500</p>
      <p>연락처: 01037368082</p>
    </footer>
  );
}
