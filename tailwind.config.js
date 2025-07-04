/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    // ─────────────────────────────────────────────────────────────
    // 1) 커스텀 브레이크포인트 추가
    //    - iPhone 11 Pro 가로 모드 기준: 896px
    //    - 실제 iOS Safari는 주소창/탭바 노출 시 약간 뷰포트가 줄어들 수 있으므로
    //      약간 낮춘 880px로 설정하였습니다.
    // ─────────────────────────────────────────────────────────────
    screens: {
      // iPhone 11 Pro landscape 모드 (CSS 픽셀 기준 약 896px → 안전하게 880px 사용)
      "iphone-land": "880px",

      // Tailwind 기본 브레이크포인트(기존)
      "sm": "640px",
      "md": "768px",
      "lg": "1024px",
      "xl": "1280px",
      "2xl": "1536px",
    },
    extend: {
      // ─────────────────────────────────────────────────────────────
      // 2) 기존 설정 유지 (custom color, fontSize, boxShadow 등)
      // ─────────────────────────────────────────────────────────────
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
