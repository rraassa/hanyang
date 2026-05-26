/** 서브페이지 footer reveal maxHeight와 맞추는 최소 높이(px) */
export const FOOTER_BLOCK_MIN_HEIGHT_PX = 128;

export default function Footer() {
  return (
    <footer
      className="flex w-full shrink-0 flex-col items-center justify-center gap-1 bg-[#fafaf5] px-4 py-6 text-center text-sm leading-snug text-gray-500 shadow-[0_-2px_20px_rgba(0,0,0,0.1)]"
      style={{ minHeight: FOOTER_BLOCK_MIN_HEIGHT_PX }}
    >
      <p className="max-w-full">한양상사 | 서울특별시 관악구 봉천로 500</p>
      <p>연락처: 01037368082</p>
    </footer>
  );
}
