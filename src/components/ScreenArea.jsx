// ScreenArea.jsx (또는 App.jsx 내 LeftPanel 컴포넌트)
import React from "react";
import "./ScreenArea.css"; // 스타일은 별도 CSS 파일로 분리

export default function ScreenArea({
  patientId,
  bedNumber,
  mode,
  onModeChange,
  onCalibrationClick,
  onNext,
  onBack,
}) {
  return (
    <div className="screen-container">
      {/* 1) 왼쪽 패널 */}
      <div className="left-panel">
        {/* 2) 상단 탭 */}
        <div className="mode-tabs">
          <button className={`tab-item ${mode === "HF" ? "active" : ""}`} onClick={() => onModeChange("HF")}>
            HF
          </button>
          <button className={`tab-item ${mode === "NEW" ? "active" : ""}`} onClick={() => onModeChange("NEW")}>
            신규 환자
          </button>
        </div>

        {/* 3) 환자 정보 박스 */}
        <div className="info-boxes">
          <div className="info-box">
            <div className="info-label">환자 ID</div>
            <div className="info-value">{patientId || "000000"}</div>
          </div>
          <div className="info-box">
            <div className="info-label">침상 번호</div>
            <div className="info-value">{bedNumber || "00000"}</div>
          </div>
          <div className="info-box">
            <div className="info-label">치료 모드</div>
            <div className="info-value">{mode === "HF" ? "HF" : mode === "CPAP" ? "CPAP" : "BI-LEVEL"}</div>
          </div>
        </div>

        {/* 4) 캘리브레이션(캐눌라/서킷) 버튼 */}
        <button className="calibration-button" onClick={onCalibrationClick}>
          캐눌라 교정
        </button>

        {/* 5) 네비게이션 버튼 (다음/뒤로) */}
        <div className="nav-buttons">
          <button className="btn-next" onClick={onNext}>다음</button>
          <button className="btn-back" onClick={onBack}>뒤로</button>
        </div>
      </div>

      {/* 6) 오른쪽 패널 (기존 Power, Dial 등 UI) */}
      <div className="right-panel">
        {/* 기존에 있던 Power 버튼, Dial 컴포넌트 등을 여기에 배치 */}
      </div>
    </div>
  );
}
