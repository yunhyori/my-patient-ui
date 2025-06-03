// src/App.jsx
import React, { useState, useRef } from "react";

export default function App() {
  // ─────────────────────────────────────────────────────────────────────────────
  // 1) 전원 & 화면 모드 상태
  // ─────────────────────────────────────────────────────────────────────────────
  const [isPowerOn, setIsPowerOn] = useState(false);
  // 화면 모드: "off" | "menu" | "new" | "settings"
  const [screenMode, setScreenMode] = useState("off");

  // ─────────────────────────────────────────────────────────────────────────────
  // 2) 신규 환자 설정 상태
  // ─────────────────────────────────────────────────────────────────────────────
  const [patientId, setPatientId] = useState("");
  const [bedNo, setBedNo] = useState("");
  const [mode, setMode] = useState("HF"); // HF / CPAP / bi-level

  const [patientError, setPatientError] = useState("");
  const [bedError, setBedError] = useState("");

  // 캘리브레이션(캐뉼라/서킷) 팝업
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [calibType, setCalibType] = useState(""); // "캐뉼라" | "T-piece" | "서킷"
  const [showInstructionModal, setShowInstructionModal] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────────
  // 3) HF 기능 설정(파라미터) 화면 상태
  // ─────────────────────────────────────────────────────────────────────────────
  // 페이지 1 → 유량, FiO2, RR 감지
  // 페이지 2 → Dew Point, 가습 레벨, TSF, Bi-Flow
  const [settingPage, setSettingPage] = useState(1);
  // 어떤 파라미터 카드가 활성 상태인지
  // "flow" | "fio2" | "rr" | "dew" | "humid" | "tsf" | "biflow" | ""
  const [activeParam, setActiveParam] = useState("");

  // 파라미터 값들
  const [flow, setFlow] = useState(30);           // 1 ~ 60
  const [fio2, setFio2] = useState(40);           // 21 ~ 100
  const [rrDetect, setRrDetect] = useState(false); // On/Off
  const [dewPoint, setDewPoint] = useState(31);   // 31 ~ 37
  const [humidLevel, setHumidLevel] = useState(3);// 1 ~ 5
  const [tsfOn, setTsfOn] = useState(false);      // On/Off
  const [biFlowOn, setBiFlowOn] = useState(false);// On/Off

  // 치료 시작/종료 팝업
  const [confirmPopup, setConfirmPopup] = useState(""); // "start" | "stop" | ""

  // 치료 중 상태
  const [isStarted, setIsStarted] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────────
  // 전원 버튼 클릭 (OFF ↔ ON)
  // ─────────────────────────────────────────────────────────────────────────────
  const handlePowerToggle = () => {
    if (isPowerOn) {
      // 전원 끄기: 모든 상태 초기화
      setIsPowerOn(false);
      setScreenMode("off");

      setPatientId("");
      setBedNo("");
      setMode("HF");
      setPatientError("");
      setBedError("");
      setShowTypeModal(false);
      setCalibType("");
      setShowInstructionModal(false);

      setSettingPage(1);
      setActiveParam("");
      setFlow(30);
      setFio2(40);
      setRrDetect(false);
      setDewPoint(31);
      setHumidLevel(3);
      setTsfOn(false);
      setBiFlowOn(false);

      setConfirmPopup("");
      setIsStarted(false);
    } else {
      // 전원 켜기 → 메뉴 화면
      setIsPowerOn(true);
      setScreenMode("menu");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 4) 치료 시작/종료 팝업 로직
  // ─────────────────────────────────────────────────────────────────────────────
  const openStartPopup = () => setConfirmPopup("start");
  const openStopPopup = () => setConfirmPopup("stop");

  const handleConfirmPopup = () => {
    if (confirmPopup === "start") {
      setIsStarted(true);
    }
    if (confirmPopup === "stop") {
      setIsStarted(false);
    }
    setConfirmPopup("");
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 5) 환자 정보 입력 검증
  // ─────────────────────────────────────────────────────────────────────────────
  const validatePatientFields = () => {
    let valid = true;
    if (patientId.trim() === "") {
      setPatientError("환자 ID를 입력하세요.");
      valid = false;
    } else {
      setPatientError("");
    }
    if (bedNo.trim() === "") {
      setBedError("침상 번호를 입력하세요.");
      valid = false;
    } else {
      setBedError("");
    }
    return valid;
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 6) 캘리브레이션(캐뉼라/서킷) 버튼 클릭
  // ─────────────────────────────────────────────────────────────────────────────
  const handleCalibButton = () => {
    if (validatePatientFields()) {
      setShowTypeModal(true);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 7) 캘리브레이션 타입 선택 → 안내 팝업
  //     - HF 모드: 캐뉼라 / T-piece
  //     - CPAP/Bi-level 모드: 서킷
  // ─────────────────────────────────────────────────────────────────────────────
  const selectCalibType = (type) => {
    setCalibType(type);  // "캐뉼라" | "T-piece" | "서킷"
    setShowTypeModal(false);
    setShowInstructionModal(true);
  };

  const handleInstructionConfirm = () => {
    // 안내 팝업 확인 후 “settings” 화면으로 이동
    setShowInstructionModal(false);
    setScreenMode("settings");
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 8) 다이얼(휠) 조작 이벤트 처리
  //    activeParam 에 따라 값 증가/감소 또는 토글
  // ─────────────────────────────────────────────────────────────────────────────
  const dialRef = useRef(null);
  const [isDialDragging, setIsDialDragging] = useState(false);
  const dragStartX = useRef(0);
  const lastDragX = useRef(0);

  const handleDialLeft = () => {
    if (activeParam === "flow") {
      setFlow((v) => Math.max(1, v - 1));
    }
    if (activeParam === "fio2") {
      setFio2((v) => Math.max(21, v - 1));
    }
    if (activeParam === "dew") {
      setDewPoint((v) => Math.max(31, v - 1));
    }
    if (activeParam === "humid") {
      setHumidLevel((v) => Math.max(1, v - 1));
    }
    if (activeParam === "tsf") {
      setTsfOn((prev) => !prev);
    }
    if (activeParam === "biflow") {
      setBiFlowOn((prev) => !prev);
    }
  };
  const handleDialRight = () => {
    if (activeParam === "flow") {
      setFlow((v) => Math.min(60, v + 1));
    }
    if (activeParam === "fio2") {
      setFio2((v) => Math.min(100, v + 1));
    }
    if (activeParam === "dew") {
      setDewPoint((v) => Math.min(37, v + 1));
    }
    if (activeParam === "humid") {
      setHumidLevel((v) => Math.min(5, v + 1));
    }
    if (activeParam === "tsf") {
      setTsfOn((prev) => !prev);
    }
    if (activeParam === "biflow") {
      setBiFlowOn((prev) => !prev);
    }
  };
  const handleDialClick = () => {
    // 클릭 시 RR 감지 On/Off 토글
    if (activeParam === "rr") {
      setRrDetect((prev) => !prev);
    }
  };

  const onDialPointerDown = (e) => {
    e.preventDefault();
    setIsDialDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    dragStartX.current = clientX;
    lastDragX.current = clientX;
  };
  const onDialPointerMove = (e) => {
    if (!isDialDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - lastDragX.current;
    if (deltaX > 10) {
      handleDialRight();
      lastDragX.current = clientX;
    } else if (deltaX < -10) {
      handleDialLeft();
      lastDragX.current = clientX;
    }
  };
  const onDialPointerUp = (e) => {
    if (!isDialDragging) return;
    setIsDialDragging(false);
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const totalDelta = clientX - dragStartX.current;
    if (Math.abs(totalDelta) < 5) {
      handleDialClick();
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 9) 화면 렌더링
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-row min-h-screen bg-gray-900">
      {/** ───────────────────────────────────────────────────────────── 
       * 좌측: 화면 전환 영역 (OFF / MENU / NEW / SETTINGS)
       * ───────────────────────────────────────────────────────────── **/}
      <div className="flex-1 bg-black text-white overflow-auto">
        {/* 화면 OFF */}
        {screenMode === "off" && (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-500 text-lg">화면이 꺼져 있습니다.</p>
          </div>
        )}

        {/* 전원 ON 상태 */}
        {screenMode !== "off" && (
          <>
            {/** ─────────────────────────────────────────────────
             * 2-1) 메뉴 화면 (신규 환자 / 기존 환자)
             * ───────────────────────────────────────────────── **/}
            {screenMode === "menu" && (
              <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-4">
                <button
                  onClick={() => setScreenMode("new")}
                  className="w-36 h-36 bg-blue-500 rounded-xl flex flex-col items-center justify-center shadow-lg hover:bg-blue-600"
                >
                  <span className="text-5xl">➕</span>
                  <span className="mt-2 text-base">신규 환자</span>
                </button>
                <button
                  onClick={() => setScreenMode("new")}
                  className="w-36 h-36 bg-green-500 rounded-xl flex flex-col items-center justify-center shadow-lg hover:bg-green-600"
                >
                  <span className="text-5xl">▶️</span>
                  <span className="mt-2 text-base">기존 환자</span>
                </button>
              </div>
            )}

            {/** ─────────────────────────────────────────────────
             * 2-2) 신규 환자 설정 화면
             * ───────────────────────────────────────────────── **/}
            {screenMode === "new" && (
              <div className="flex w-full h-full">
                {/** ── [A] 세로 네비게이션 ── **/}
                <div className="w-20 bg-gray-800 flex flex-col items-center pt-8 space-y-6">
                  <button
                    className={`text-lg font-semibold ${
                      mode === "HF" ? "text-white" : "text-gray-400"
                    }`}
                    onClick={() => setMode("HF")}
                  >
                    HF
                  </button>
                  <button
                    className={`text-lg font-semibold ${
                      screenMode === "new" ? "text-white" : "text-gray-400"
                    }`}
                    onClick={() => setScreenMode("new")}
                  >
                    신규
                    <br />
                    환자
                  </button>
                </div>

                {/** ── [B] 환자 설정 박스 ── **/}
                <div className="flex-1 p-6 flex flex-col">
                  <h2 className="text-2xl mb-6 text-white">환자 설정</h2>

                  {/** [B-1] 맨 위 3개 카드: “환자 ID”, “침상 번호”, “치료 모드” **/}
                  <div className="flex justify-between mb-8 space-x-4">
                    {/* ■ 환자 ID */}
                    <div className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col">
                      <div className="text-gray-400 text-sm mb-1">환자 ID</div>
                      <input
                        type="text"
                        value={patientId}
                        onChange={(e) => {
                          setPatientId(e.target.value);
                          if (e.target.value.trim() !== "") {
                            setPatientError("");
                          }
                        }}
                        className="mt-auto rounded bg-gray-900 text-white px-2 py-1 text-lg"
                        placeholder="예: 000001"
                      />
                      {patientError && (
                        <p className="mt-1 text-xs text-red-400">
                          {patientError}
                        </p>
                      )}
                    </div>

                    {/* ■ 침상 번호 */}
                    <div className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col">
                      <div className="text-gray-400 text-sm mb-1">침상 번호</div>
                      <input
                        type="text"
                        value={bedNo}
                        onChange={(e) => {
                          setBedNo(e.target.value);
                          if (e.target.value.trim() !== "") {
                            setBedError("");
                          }
                        }}
                        className="mt-auto rounded bg-gray-900 text-white px-2 py-1 text-lg"
                        placeholder="예: 101"
                      />
                      {bedError && (
                        <p className="mt-1 text-xs text-red-400">
                          {bedError}
                        </p>
                      )}
                    </div>

                    {/* ■ 치료 모드 */}
                    <div className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col">
                      <div className="text-gray-400 text-sm mb-1">치료 모드</div>
                      <select
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                        className="mt-auto rounded bg-gray-900 text-white px-2 py-1 text-lg"
                      >
                        <option value="HF">HF</option>
                        <option value="CPAP">CPAP</option>
                        <option value="bi-level">bi-level</option>
                      </select>
                    </div>
                  </div>

                  {/** [B-2] 캘리브레이션(교정) 버튼 **/}
                  <div className="mb-8">
                    {mode === "HF" ? (
                      <button
                        onClick={handleCalibButton}
                        className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800"
                      >
                        캐뉼라 교정
                      </button>
                    ) : (
                      <button
                        onClick={handleCalibButton}
                        className="w-full bg-indigo-700 text-white py-3 rounded-lg hover:bg-indigo-800"
                      >
                        서킷 교정
                      </button>
                    )}
                  </div>

                  {/** [B-3] “다음” / “뒤로” 버튼 **/}
                  <div className="flex gap-4 mb-6">
                    <button
                      onClick={() => {
                        if (validatePatientFields()) {
                          setScreenMode("settings");
                        }
                      }}
                      className="flex-1 bg-green-600 py-3 rounded-lg hover:bg-green-700"
                    >
                      다음
                    </button>
                    <button
                      onClick={() => setScreenMode("menu")}
                      className="flex-1 bg-gray-700 py-3 rounded-lg hover:bg-gray-600"
                    >
                      뒤로
                    </button>
                  </div>

                  {/** [B-4] 캘리브레이션 타입 선택 모달 **/}
                  {showTypeModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                      <div className="bg-gray-800 rounded-xl w-80 p-6 space-y-4">
                        <h3 className="text-white text-lg">교정 유형 선택</h3>
                        <p className="text-gray-300 text-sm">
                          {mode === "HF"
                            ? "1. 캐뉼라 유형을 선택하십시오."
                            : "1. 서킷 유형을 선택하십시오."}
                        </p>
                        <div className="flex justify-between mt-4 space-x-2">
                          {mode === "HF" ? (
                            <>
                              <button
                                onClick={() => selectCalibType("캐뉼라")}
                                className="flex-1 bg-blue-600 py-2 rounded-lg text-white hover:bg-blue-700"
                              >
                                캐뉼라
                              </button>
                              <button
                                onClick={() => selectCalibType("T-piece")}
                                className="flex-1 bg-blue-600 py-2 rounded-lg text-white hover:bg-blue-700"
                              >
                                T-piece
                              </button>
                              <button
                                onClick={() => setShowTypeModal(false)}
                                className="flex-1 bg-gray-600 py-2 rounded-lg text-white hover:bg-gray-500"
                              >
                                취소
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => selectCalibType("서킷")}
                                className="flex-1 bg-indigo-600 py-2 rounded-lg text-white hover:bg-indigo-700"
                              >
                                서킷
                              </button>
                              <button
                                onClick={() => setShowTypeModal(false)}
                                className="flex-1 bg-gray-600 py-2.rounded-lg text-white.hover:bg-gray-500"
                              >
                                취소
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/** [B-5] 안내(Instruction) 팝업 **/}
                  {showInstructionModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                      <div className="bg-gray-800 rounded-xl w-80 p-6 space-y-4">
                        <h3 className="text-white text-lg">교정 진행 시 주의사항</h3>
                        <ul className="text-gray-300 text-sm list-decimal list-inside space-y-1">
                          <li>
                            박테리아 필터, 가습 챔버, 서킷과 캐뉼라를 올바르게
                            장착하십시오.
                          </li>
                          <li>서킷, 캐뉼라, 에어 홀이 막히지 않도록 하십시오.</li>
                          <li>교정 진행 중에 장치 및 서킷 또는 캐뉼라를 움직이지 마십시오.</li>
                        </ul>
                        <div className="mt-4 flex justify-center gap-4">
                          <button
                            onClick={handleInstructionConfirm}
                            className="flex-1 bg-green-600 py-2.rounded-lg text-white.hover:bg-green-700"
                          >
                            확인
                          </button>
                          <button
                            onClick={() => {
                              setShowInstructionModal(false);
                              setScreenMode("new");
                            }}
                            className="flex-1 bg-gray-600 py-2.rounded-lg text-white.hover:bg-gray-500"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/** ─────────────────────────────────────────────────
             * 2-3) HF 기능 설정 파라미터 화면 (settings 모드)
             * ───────────────────────────────────────────────── **/}
            {screenMode === "settings" && (
              <div className="flex w-full h-full overflow-auto">
                {/** ── [A] 왼쪽 페이지 네비게이션 (↑ / 페이지번호 / ↓) ── **/}
                <div className="w-20 bg-gray-800 flex flex-col items-center py-8 space-y-4">
                  {/* 위로 */}
                  <button
                    onClick={() => setSettingPage((p) => Math.max(1, p - 1))}
                    className="text-3xl text-gray-400 hover:text-white"
                  >
                    ↑
                  </button>

                  {/* 페이지 표시 */}
                  <div className="text-white text-lg">{settingPage} / 2</div>

                  {/* 아래로 */}
                  <button
                    onClick={() => setSettingPage((p) => Math.min(2, p + 1))}
                    className="text-3xl text-gray-400 hover:text-white"
                  >
                    ↓
                  </button>
                </div>

                {/** ── [B] 파라미터 카드 영역 ── **/}
                <div className="flex-1 p-6 flex flex-col items-center">
                  <h2 className="text-2xl mb-6 text-white">
                    HF 기능 설정 파라미터
                  </h2>

                  {/** Page 1: 유량 / FiO₂ / RR 감지 **/}
                  {settingPage === 1 && (
                    <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
                      {/* ■ 유량(Flow) 카드 */}
                      <div
                        onClick={() => setActiveParam("flow")}
                        className={`relative bg-gray-800 border ${
                          activeParam === "flow"
                            ? "border-green-400"
                            : "border-gray-700"
                        } rounded-lg p-4 flex flex-col cursor-pointer`}
                      >
                        <div className="text-gray-400 text-sm mb-1">
                          유량 (LPM)
                        </div>
                        <div className="flex items-baseline justify-center">
                          <span className="text-5xl font-bold">{flow}</span>
                          <span className="text-xl text-gray-400 ml-2">LPM</span>
                        </div>
                        <div className="absolute bottom-2 right-4 text-xs text-gray-500">
                          1&nbsp;~&nbsp;60
                        </div>
                      </div>

                      {/* ■ FiO₂ 카드 */}
                      <div
                        onClick={() => setActiveParam("fio2")}
                        className={`relative bg-gray-800 border ${
                          activeParam === "fio2"
                            ? "border-green-400"
                            : "border-gray-700"
                        } rounded-lg p-4 flex flex-col cursor-pointer`}
                      >
                        <div className="text-gray-400 text-sm mb-1">FiO₂ (%)</div>
                        <div className="flex items-baseline justify-center">
                          <span className="text-5xl font-bold">{fio2}</span>
                          <span className="text-xl text-gray-400 ml-2">%</span>
                        </div>
                        <div className="absolute bottom-2 right-4 text-xs text-gray-500">
                          21&nbsp;~&nbsp;100
                        </div>
                      </div>

                      {/* ■ RR 감지(On/Off) 카드 (두 열 전체 차지) */}
                      <div
                        onClick={() => setActiveParam("rr")}
                        className={`col-span-2 relative bg-gray-800 border ${
                          activeParam === "rr"
                            ? "border-green-400"
                            : "border-gray-700"
                        } rounded-lg p-4 flex flex-col items-center cursor-pointer`}
                      >
                        <div className="text-gray-400 text-sm mb-1">
                          RR 감지
                        </div>
                        <div className="text-5xl font-bold">
                          {rrDetect ? "켜짐" : "꺼짐"}
                        </div>
                        <div className="absolute bottom-2 right-4 text-xs text-gray-500">
                          {/* On / Off */}
                        </div>
                      </div>
                    </div>
                  )}

                  {/** Page 2: Dew Point / 가습 레벨 / TSF(On/Off) / Bi-Flow(On/Off) **/}
                  {settingPage === 2 && (
                    <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
                      {/* ■ Dew Point 카드 */}
                      <div
                        onClick={() => setActiveParam("dew")}
                        className={`relative bg-gray-800 border ${
                          activeParam === "dew"
                            ? "border-green-400"
                            : "border-gray-700"
                        } rounded-lg p-4 flex flex-col cursor-pointer`}
                      >
                        <div className="text-gray-400 text-sm mb-1">
                          Dew Point (℃)
                        </div>
                        <div className="flex items-baseline justify-center">
                          <span className="text-5xl font-bold">{dewPoint}</span>
                          <span className="text-xl text-gray-400 ml-2">℃</span>
                        </div>
                        <div className="absolute bottom-2 right-4 text-xs text-gray-500">
                          31&nbsp;~&nbsp;37
                        </div>
                      </div>

                      {/* ■ 가습 레벨 카드 */}
                      <div
                        onClick={() => setActiveParam("humid")}
                        className={`relative bg-gray-800 border ${
                          activeParam === "humid"
                            ? "border-green-400"
                            : "border-gray-700"
                        } rounded-lg p-4 flex flex-col cursor-pointer`}
                      >
                        <div className="text-gray-400 text-sm mb-1">
                          가습 레벨
                        </div>
                        <div className="flex items-baseline justify-center">
                          <span className="text-5xl font-bold">{humidLevel}</span>
                        </div>
                        <div className="absolute bottom-2 right-4 text-xs text-gray-500">
                          1&nbsp;~&nbsp;5
                        </div>
                      </div>

                      {/* ■ TSF(On/Off) 카드 */}
                      <div
                        onClick={() => setActiveParam("tsf")}
                        className={`relative bg-gray-800 border ${
                          activeParam === "tsf"
                            ? "border-green-400"
                            : "border-gray-700"
                        } rounded-lg p-4 flex flex-col cursor-pointer`}
                      >
                        <div className="text-gray-400 text-sm mb-1">
                          TSF (옵션)
                        </div>
                        <div className="text-5xl font-bold">
                          {tsfOn ? "켜짐" : "꺼짐"}
                        </div>
                        <div className="absolute bottom-2 right-4 text-xs text-gray-500">
                          {/* On / Off */}
                        </div>
                      </div>

                      {/* ■ Bi-Flow(On/Off) 카드 */}
                      <div
                        onClick={() => setActiveParam("biflow")}
                        className={`relative bg-gray-800 border ${
                          activeParam === "biflow"
                            ? "border-green-400"
                            : "border-gray-700"
                        } rounded-lg p-4 flex flex-col cursor-pointer`}
                      >
                        <div className="text-gray-400 text-sm mb-1">
                          Bi-Flow (옵션)
                        </div>
                        <div className="text-5xl font-bold">
                          {biFlowOn ? "켜짐" : "꺼짐"}
                        </div>
                        <div className="absolute bottom-2 right-4 text-xs text-gray-500">
                          {/* On / Off */}
                        </div>
                      </div>
                    </div>
                  )}

                  {/** [C] 단일 액션 버튼: “치료 시작” ⇄ “치료 종료” **/}
                  <div className="mt-8 w-full max-w-2xl">
                    <button
                      onClick={() => {
                        // isStarted에 따라 팝업 띄우기
                        if (isStarted) {
                          openStopPopup();
                        } else {
                          openStartPopup();
                        }
                      }}
                      className={`w-full py-4 rounded-lg flex items-center justify-center text-white 
                        ${isStarted ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
                    >
                      {isStarted ? (
                        /* 치료 중일 때: “중지 ▇” */
                        <span className="flex items-center gap-2 text-xl font-semibold">
                          <span>중지</span>
                          <span className="text-2xl">▇</span> {/* 정지 아이콘(Unicode U+2587) */}
                        </span>
                      ) : (
                        /* 대기 상태일 때: “시작 ▶” */
                        <span className="flex items-center gap-2 text-xl font-semibold">
                          <span>시작</span>
                          <span className="text-2xl">▶</span> {/* 재생 아이콘(Unicode U+25B6) */}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/** ─────────────────────────────────────────────────────────────
       * 우측: 전원 버튼 + 다이얼 버튼 (고정 너비 w-36)
       * ───────────────────────────────────────────────────────────── **/}
      <div className="flex-none w-36 bg-gray-800 flex flex-col items-center justify-center space-y-8 py-8">
        {/* 전원 버튼 */}
        <button
          onClick={handlePowerToggle}
          className={`w-16 h-16 flex items-center justify-center rounded-full border-2 ${
            isPowerOn
              ? "border-green-400 bg-gray-900 hover:bg-gray-800"
              : "border-red-400 bg-gray-900 hover:bg-gray-800"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-8 h-8 ${
              isPowerOn ? "text-green-400" : "text-red-400"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v9m0 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
            />
          </svg>
        </button>

        {/* 다이얼 버튼 */}
        <div
          ref={dialRef}
          onMouseDown={onDialPointerDown}
          onMouseMove={onDialPointerMove}
          onMouseUp={onDialPointerUp}
          onMouseLeave={onDialPointerUp}
          onTouchStart={onDialPointerDown}
          onTouchMove={onDialPointerMove}
          onTouchEnd={onDialPointerUp}
          className="relative w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center touch-action-none"
        >
          {/* 다이얼 링 */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-600"></div>
          {/* 다이얼 중앙부 */}
          <div className="w-12 h-12 rounded-full bg-gray-500"></div>
        </div>
      </div>

      {/** ─────────────────────────────────────────────────────────────
       * 치료 시작/종료 확인 팝업
       * ───────────────────────────────────────────────────────────── **/}
      {confirmPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl text-center w-80">
            <p className="mb-4 text-white">
              {confirmPopup === "start"
                ? "치료를 시작하시겠습니까?"
                : "치료를 종료하시겠습니까?"}
            </p>
            <div className="flex justify-center gap-6">
              <button
                onClick={handleConfirmPopup}
                className="flex-1 bg-blue-600 py-2.rounded-lg text-white.hover:bg-blue-700"
              >
                확인
              </button>
              <button
                onClick={() => setConfirmPopup("")}
                className="flex-1 bg-gray-600 py-2.rounded-lg text-white.hover:bg-gray-500"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
