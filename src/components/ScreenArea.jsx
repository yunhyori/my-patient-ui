// src/components/ScreenArea.jsx

import React, { useRef, useEffect } from "react";
// SVG import 완전히 제거하고, Heroicons만 사용합니다.
import { ExclamationTriangleIcon, AdjustmentsVerticalIcon } from "@heroicons/react/24/outline";

export default function ScreenArea({
  patientId,
  bedNo,
  currentPSI,
  respRate,
  onAlarm,
  onParameterChange,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;
    let t = 0;

    function drawWave() {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "#00FF00";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin((x + t) * 0.05) * (height / 4);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      t += 2;
      animationId = requestAnimationFrame(drawWave);
    }

    drawWave();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="relative flex-1 flex flex-col">
      {/* 좌측 상단: 환자 정보 */}
      <div className="absolute top-4 left-4 text-screen-lg font-semibold text-white">
        환자 ID: {patientId || "--"} / 침상: {bedNo || "--"}
      </div>

      {/* 우측 상단: 경고·펌프 아이콘 (Heroicons 사용) */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />
        <AdjustmentsVerticalIcon className="w-6 h-6 text-gray-300" />
      </div>

      {/* 중앙: 캔버스 기반 실시간 파형 */}
      <div className="flex-1 flex items-center justify-center px-4">
        <canvas
          ref={canvasRef}
          width={600}
          height={300}
          className="bg-[#111111] rounded-lg"
        />
      </div>

      {/* 하단: 실시간 수치(PSI, RR) */}
      <div className="absolute bottom-4 left-4 text-screen-base font-mono text-white">
        PSI: {currentPSI?.toFixed(1) || "--"} / RR: {respRate || "--"}
      </div>

      {/* 하단 중앙: 진행바 예시 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gray-700 rounded-full">
        <div
          className="h-full bg-green-400 rounded-full"
          style={{ width: "50%" }} /* 예시: 50% 진행 */
        />
      </div>
    </div>
  );
}
