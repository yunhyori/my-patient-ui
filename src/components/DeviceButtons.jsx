// ─────────────────────────────────────────────────
// src/components/DeviceButtons.jsx
// ─────────────────────────────────────────────────
import React from "react";

/**
 * 전원 버튼과 다이얼 버튼을 “원래대로” 보여주는 컴포넌트입니다.
 * - 전원 버튼(윗쪽 원형) : 클릭 시(onPowerToggle) 호출
 * - 다이얼 버튼(아랫쪽 큰 원형) : 실제 동작이 필요 없으면 단순 시각적 요소
 *
 * App.jsx에서 onPowerToggle 함수를 props로 전달하면, 클릭 시 호출됩니다.
 */
export default function DeviceButtons({ isScreenOn, onPowerToggle }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 p-4 space-y-6">
      {/* 전원 버튼 영역 */}
      <button
        onClick={onPowerToggle}
        className={`w-16 h-16 flex items-center justify-center rounded-full border-2 
          ${isScreenOn ? "border-green-400 bg-gray-900 hover:bg-gray-800" 
                       : "border-red-400 bg-gray-900 hover:bg-gray-800"}`}
      >
        {/* 전원 아이콘 (SVG 그대로 복원) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-8 h-8 ${isScreenOn ? "text-green-400" : "text-red-400"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v9m0 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        </svg>
      </button>

      {/* 다이얼 버튼 영역 */}
      <div className="relative w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
        {/* 바깥 회색 테두리 */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-600"></div>
        {/* 중앙 원형 (실제 다이얼) */}
        <div className="w-10 h-10 rounded-full bg-gray-500"></div>
      </div>
    </div>
  );
}
