import React from 'react'

export default function ScreenArea({
  powerOn,
  currentMode,
  flowValue,
  fio2Value,
  dewPointValue,
  humidLevel,
  isStarted,
  // … 필요하다면 더 props 추가
}) {
  return (
    <div className="h-full bg-black text-white flex flex-col">
      { !powerOn ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-gray-500 text-lg">화면 꺼짐</span>
        </div>
      ) : (
        <div className="flex-1 p-4 flex flex-col">
          {/* 예시 : 상단에 환자 정보 영역 */}
          <div className="mb-4">
            <p>환자 ID: {/* … */}</p>
            <p>침상 번호: {/* … */}</p>
          </div>

          {/* 예시 : 현재 모드, 유량, FiO₂, 그래프 등 */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 bg-gray-800 p-2 rounded">
              <p className="text-center">모드: { currentMode }</p>
            </div>
            <div className="flex-1 bg-gray-800 p-2 rounded">
              <p className="text-center">유량: { flowValue } LPM</p>
            </div>
            <div className="flex-1 bg-gray-800 p-2 rounded">
              <p className="text-center">FiO₂: { fio2Value }%</p>
            </div>
          </div>

          {/* 예시 : 실시간 그래프나 상태창 (모사) */}
          <div className="flex-1 bg-gray-900 rounded flex items-center justify-center">
            <span className="text-gray-600">
              {isStarted ? '치료 중… 그래프 애니메이션 영역' : '치료 대기 중'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
