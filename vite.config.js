// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
  // 개발(dev)일 때는 '/', 배포(build)일 때만 '/my-patient-ui/' 로 바꾸기
    base: mode === 'production' ? '/my-patient-ui/' : '/',

    plugins: [react()],

    // ─────────────────────────────────────────────────────────────
    // 개발 서버 설정: 로컬 IP(192.168.0.11)에 바인딩
    // ─────────────────────────────────────────────────────────────
    // server: {
    //   // 개발(dev) 모드에서만 적용됩니다.
    //   // '192.168.0.11' 대신 실제 내 컴퓨터의 IP로 바꿔주세요.
    //   host: '192.168.0.11',

    //   // (선택) 기본 포트(5173) 대신 다른 포트를 쓰고 싶으면 여기서 설정
    //   // 예: port: 3000,
    //   // port: 5173,
    // },
  };
});
