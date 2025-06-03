// src/components/DeviceButtons.jsx
import React from "react";

export default function DeviceButtons({
  powerOn,
  onPowerToggle,
  mode,
}) {
  return (
    <div className="absolute top-0 left-0 right-0 flex">
      {/* 상단 STATUS ICONS(왼쪽) */}
      <div className="flex items-center gap-3 p-2">
        <div className="w-6 h-6 bg-gray-700 rounded flex justify-center items-center">
          {/* 손바닥 아이콘 */}
          <span className="text-white">✋</span>
        </div>
        <div className="w-6 h-6 bg-gray-700 rounded relative">
          {/* 벨 아이콘 + 점 */}
          <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">🔔</span>
          <div className="absolute bottom-0 left-0 flex space-x-0.5">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* 전원 버튼(오른쪽 끝) */}
      <div className="ml-auto flex items-center gap-3 p-2">
        {/* AC, 배터리, 뒤로가기 등 아이콘 */}
        <div className="flex items-center gap-2">
          {/* 유선 아이콘 */}
          <span className="text-green-400">AC</span>
          <div className="w-6 h-6 bg-gray-700 rounded flex justify-center items-center">
            <span className="text-green-300">🔋</span>
          </div>
          <button
            className="w-8 h-8 bg-red-600 rounded flex justify-center items-center"
            onClick={onPowerToggle}
          >
            {powerOn ? "■" : "▶️"}
          </button>
          <div className="w-6 h-6 bg-gray-700 rounded flex justify-center items-center">
            <span className="text-white">↩️</span>
          </div>
        </div>
      </div>

      {/* 왼쪽 사이드 메뉴 (vertical) */}
      <div className="absolute top-16 left-0 bg-gray-900 w-16 flex flex-col items-center py-4 space-y-4">
        <div className="text-white font-bold">HF</div>
        <button
          className="bg-blue-500 w-12 h-12 flex flex-col justify-center items-center rounded"
        >
          {/* 신규 환자 아이콘 */}
          <span className="text-2xl">＋</span>
          <span className="text-xs mt-1">신규</span>
        </button>
        <button
          className="bg-green-500 w-12 h-12 flex flex-col justify-center items-center rounded"
        >
          {/* 기존 환자 아이콘 */}
          <span className="text-2xl">▶️</span>
          <span className="text-xs mt-1">기존</span>
        </button>
      </div>

      {/* 다이얼(▲▼) 버튼 - 가로 모드에서만 오른쪽에 표시 */}
      <div className="absolute top-32 right-0 flex flex-col items-center space-y-2 p-2">
        <button className="bg-gray-700 w-12 h-12 flex justify-center items-center rounded">
          ▲
        </button>
        <div className="text-xs text-gray-300">1 / 2</div>
        <button className="bg-gray-700 w-12 h-12 flex justify-center items-center rounded">
          ▼
        </button>
      </div>
    </div>
  );
}
