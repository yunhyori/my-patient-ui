// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 개발(dev)일 때는 '/', 배포(build)일 때만 '/my-patient-ui/' 로 바꾸기
  base: process.env.NODE_ENV === 'production' ? '/my-patient-ui/' : '/',
  plugins: [react()],
})