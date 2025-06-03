// ─────────────────────────────────────────────────
// src/components/ScreenUI.jsx
// ─────────────────────────────────────────────────
import React, { useState } from "react";

export default function ScreenUI() {
  // 1) 전원 상태 관리 (문맥상 App에서 props로 내려주기 때문에 내부에는 없음)
  // 2) 화면(On/Off) 상태도 App에서 props로 내려주므로 여기서는 받기만

  // 화면 모드(menu / new / settings / off)를 App으로부터 props로 받음
  // (화면이 꺼져 있으면 'off' 상태, 그 외엔 기존 모드)
  return null; // 이 컴포넌트는 App.jsx에서 직접 사용하지 않고, 아래처럼 props-driven으로 렌더링됩니다.
}
