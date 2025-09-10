// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#f8f8f3",
        navy: "#1c2b5a",
        darkGray: "#1a1a1a",
        footerText: "#ffffff",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'), // ✅ 스크롤바 숨기기 플러그인 추가
  ],
};
