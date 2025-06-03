import React from 'react'

export default function ControlPanel({
  powerOn,
  onTogglePower,
  onChangeMode,
  currentMode,
  onAdjustFlow,
  onAdjustFiO2,
  onAdjustDewPoint,
  onAdjustHumid,
  isStarted,
  onStartTreatment,
  onStopTreatment,
  // … 필요에 따라 더 props 정의
}) {
  return (
    <div className="w-full md:w-1/4 bg-gray-800 flex flex-col items-center p-4 gap-4">
      {/* 1) 전원 버튼 */}
      <button
        onClick={onTogglePower}
        className={`
          w-14 h-14 rounded-full border-2 border-gray-400 
          flex items-center justify-center
          ${powerOn ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}
          transition-colors
        `}
      >
        {/* SVG 전원 아이콘 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      <p className="text-sm text-gray-300">{powerOn ? '전원 ON' : '전원 OFF'}</p>

      {/* 2) 모드 전환 다이얼 */}
      <div className="flex flex-col items-center">
        <label className="text-gray-300 mb-1">치료 모드</label>
        <select
          value={currentMode}
          onChange={(e) => onChangeMode(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded"
        >
          <option value="HF">HF</option>
          <option value="CPAP">CPAP</option>
          <option value="bi-level">bi-level</option>
        </select>
      </div>

      {/* 3) 유량 조절 버튼 */}
      <div className="flex flex-col items-center">
        <label className="text-gray-300 mb-1">유량 (LPM)</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAdjustFlow(-1)}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            –
          </button>
          <span className="text-white">{/* flowValue */}</span>
          <button
            onClick={() => onAdjustFlow(+1)}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* 4) FiO₂ 조절 버튼 */}
      <div className="flex flex-col items-center">
        <label className="text-gray-300 mb-1">FiO₂ (%)</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAdjustFiO2(-1)}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            –
          </button>
          <span className="text-white">{/* fio2Value */}</span>
          <button
            onClick={() => onAdjustFiO2(+1)}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* 5) Dew Point 조절 버튼 */}
      <div className="flex flex-col items-center">
        <label className="text-gray-300 mb-1">Dew Point (℃)</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAdjustDewPoint(-1)}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            –
          </button>
          <span className="text-white">{/* dewPointValue */}</span>
          <button
            onClick={() => onAdjustDewPoint(+1)}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* 6) 가습 레벨 조절 버튼 */}
      <div className="flex flex-col items-center">
        <label className="text-gray-300 mb-1">가습 레벨</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAdjustHumid(-1)}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            –
          </button>
          <span className="text-white">{/* humidLevel */}</span>
          <button
            onClick={() => onAdjustHumid(+1)}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* 7) 시작/종료 버튼 */}
      <div className="mt-4">
        {isStarted ? (
          <button
            onClick={onStopTreatment}
            className="bg-red-700 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors"
          >
            종료
          </button>
        ) : (
          <button
            onClick={onStartTreatment}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-500 transition-colors"
          >
            시작
          </button>
        )}
      </div>
    </div>
  )
}
