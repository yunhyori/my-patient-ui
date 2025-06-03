/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        screenBg: "#0A0A0A",         // 모니터 배경
        panelBg: "#1F1F1F",          // 버튼 패널 배경
        buttonBorder: "#888888",     // 버튼 테두리
        buttonShadowDark: "#171717", // 네오모픽 그림자(어두운 쪽)
        buttonShadowLight: "#373737",// 네오모픽 그림자(밝은 쪽)
        buttonActiveBg: "#2b2b2b",   // 버튼 클릭 시 배경
      },
      fontSize: {
        "screen-xl": "1.5rem",
        "screen-lg": "1.25rem",
        "screen-base": "1rem",
        "screen-sm": "0.875rem",
      },
      boxShadow: {
        "btn-default": "5px 5px 10px #171717, -5px -5px 10px #373737",
        "btn-pressed": "inset 5px 5px 10px #171717, inset -5px -5px 10px #373737"
      }
    }
  },
  plugins: [],
};
