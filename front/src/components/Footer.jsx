// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="w-full bg-[#fafaf5] text-center text-sm text-gray-500 py-6 mt-0 shadow-[0_-2px_20px_rgba(0,0,0,0.1)]">
      <p>한양상사 | 서울특별시 관악구 봉천로 500</p>
      <p className="mt-1">
        연락처:{" "}
        <a
          href="tel:01037368082"
          className="font-semibold text-[#0E2A7B] underline underline-offset-2 hover:text-[#0a1f5c]"
        >
          전화하기
        </a>
      </p>
    </footer>
  );
}
