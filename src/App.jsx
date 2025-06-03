// ───────────────────────────────────────────────────────────────────────────────
// src/App.jsx
// ───────────────────────────────────────────────────────────────────────────────
import React, { useState, useRef } from "react";

export default function App() {
  // ─────────────────────────────────────────────────────────────────────────────
  // 1) 전원 상태 관리
  // ─────────────────────────────────────────────────────────────────────────────
  const [isPowerOn, setIsPowerOn] = useState(false);
  // 화면 모드: "off" | "menu" | "new" | "settings"
  const [screenMode, setScreenMode] = useState("off");

  // ─────────────────────────────────────────────────────────────────────────────
  // 2) 신규 환자 / 기존 환자 → 환자 설정에 필요한 상태
  // ─────────────────────────────────────────────────────────────────────────────
  const [patientId, setPatientId] = useState("");
  const [bedNo, setBedNo] = useState("");
  const [mode, setMode] = useState("HF"); // HF / CPAP / bi-level

  // 입력 검증용 에러 메시지
  const [patientError, setPatientError] = useState("");
  const [bedError, setBedError] = useState("");

  // 캐뉼라/서킷 교정 단계: 타입 선택 팝업, 안내 팝업
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [calibType, setCalibType] = useState(""); // "캐뉼라" or "T-piece"
  const [showInstructionModal, setShowInstructionModal] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────────
  // 3) 파라미터 입력 화면에서 필요한 상태
  // ─────────────────────────────────────────────────────────────────────────────
  const [flow, setFlow] = useState(30); // 1~60
  const [fio2, setFio2] = useState(40); // 21~100
  const [dewPoint, setDewPoint] = useState(31); // HF:31~37 / CPAP·bi-level: 비활성
  const [humidLevel, setHumidLevel] = useState(3); // 1~5

  // 치료 시작/종료 팝업
  const [confirmPopup, setConfirmPopup] = useState(""); // "start" | "stop" | ""

  // 치료 중/대기 상태
  const [isStarted, setIsStarted] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────────
  // 전원 버튼 클릭 핸들러: OFF↔ON 토글
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
      setFlow(30);
      setFio2(40);
      setDewPoint(31);
      setHumidLevel(3);
      setConfirmPopup("");
      setIsStarted(false);
    } else {
      // 전원 켜기 → 메뉴 화면
      setIsPowerOn(true);
      setScreenMode("menu");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 치료 시작/종료를 위한 팝업 열기
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
  //  필수 입력 검증: 환자 ID, 침상 번호가 비어 있는지 확인
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
  // 캐뉼라/서킷 교정 버튼 클릭 시 (필수 입력 검증 후 팝업 오픈)
  // ─────────────────────────────────────────────────────────────────────────────
  const handleCalibButton = () => {
    if (validatePatientFields()) {
      setShowTypeModal(true);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  //  타입 선택(캐뉼라 또는 T-piece) → 안내 팝업 열기
  // ─────────────────────────────────────────────────────────────────────────────
  const selectCalibType = (type) => {
    setCalibType(type);      // "캐뉼라" or "T-piece"
    setShowTypeModal(false); // 타입 모달 닫기
    setShowInstructionModal(true); // 안내 팝업 열기
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 안내 팝업 확인 → 파라미터 입력 화면으로 이동
  // ─────────────────────────────────────────────────────────────────────────────
  const handleInstructionConfirm = () => {
    setShowInstructionModal(false);
    setScreenMode("settings");
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 유량(Flow) 증가/감소 (1~60 범위)
  // ─────────────────────────────────────────────────────────────────────────────
  const decFlow = () => setFlow((f) => Math.max(1, f - 1));
  const incFlow = () => setFlow((f) => Math.min(60, f + 1));

  // ─────────────────────────────────────────────────────────────────────────────
  // FiO2 증가/감소 (21~100 범위)
  // ─────────────────────────────────────────────────────────────────────────────
  const decFiO2 = () => setFio2((f) => Math.max(21, f - 1));
  const incFiO2 = () => setFio2((f) => Math.min(100, f + 1));

  // ─────────────────────────────────────────────────────────────────────────────
  // Dew Point 증가/감소 (HF:31~37 / CPAP·bi-level: 비활성)
  // ─────────────────────────────────────────────────────────────────────────────
  const decDew = () => {
    if (mode === "HF") setDewPoint((d) => Math.max(31, d - 1));
  };
  const incDew = () => {
    if (mode === "HF") setDewPoint((d) => Math.min(37, d + 1));
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 가습 레벨 증가/감소 (1~5)
  // ─────────────────────────────────────────────────────────────────────────────
  const decHumid = () => setHumidLevel((h) => Math.max(1, h - 1));
  const incHumid = () => setHumidLevel((h) => Math.min(5, h + 1));

  // ─────────────────────────────────────────────────────────────────────────────
  // 4) 다이얼 버튼 제스처(드래그) / 클릭 처리
  // ─────────────────────────────────────────────────────────────────────────────
  const dialRef = useRef(null);
  const [isDialDragging, setIsDialDragging] = useState(false);
  const dragStartX = useRef(0);
  const lastDragX = useRef(0);

  // 방향키 또는 클릭 동작을 실제로 수행할 함수들 (필요에 따라 수정)
  const handleDialLeft = () => {
    console.log("다이얼 → 왼쪽 이동(←) 감지됨");
    // 실제 기능: 방향키 왼쪽 기능
  };
  const handleDialRight = () => {
    console.log("다이얼 → 오른쪽 이동(→) 감지됨");
    // 실제 기능: 방향키 오른쪽 기능
  };
  const handleDialClick = () => {
    console.log("다이얼 클릭(터치) 감지됨");
    // 실제 기능: 엔터키 혹은 클릭 기능
  };

  // 터치/마우스 시작 시
  const onDialPointerDown = (e) => {
    e.preventDefault();
    setIsDialDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    dragStartX.current = clientX;
    lastDragX.current = clientX;
  };

  // 터치/마우스 움직일 때
  const onDialPointerMove = (e) => {
    if (!isDialDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - lastDragX.current;

    // 일정 threshold 이상 이동 시마다 한번씩 좌/우 처리( threshold: 10px )
    if (deltaX > 10) {
      handleDialRight();
      lastDragX.current = clientX;
    } else if (deltaX < -10) {
      handleDialLeft();
      lastDragX.current = clientX;
    }
  };

  // 터치/마우스 종료 시 (드래그가 없었으면 클릭으로 간주)
  const onDialPointerUp = (e) => {
    if (!isDialDragging) return;
    setIsDialDragging(false);
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const totalDelta = clientX - dragStartX.current;

    // 드래그 거리(총 이동량)가 작으면 클릭으로 간주 (threshold: 5px)
    if (Math.abs(totalDelta) < 5) {
      handleDialClick();
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 화면 렌더링
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900">
      {/** ──────────────────────────────────────────────────────────────────────────
       * 좌측: 화면 UI 영역
       * ────────────────────────────────────────────────────────────────────────── */}
      <div className="flex-1 bg-black text-white overflow-auto">
        {/* 1) 전원 OFF 상태 */}
        {screenMode === "off" && (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-500 text-lg">화면이 꺼져 있습니다.</p>
          </div>
        )}

        {/* 2) 전원 ON 상태 */}
        {screenMode !== "off" && (
          <>
            {/** ────────────────────────────────────────────────────────────────────
             * 2-1) 메뉴 화면 (신규 환자 / 기존 환자)
             * ──────────────────────────────────────────────────────────────────── */}
            {screenMode === "menu" && (
              <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-4">
                <button
                  onClick={() => {
                    // 메뉴에서 '신규 환자' 클릭하면 환자 설정 화면으로 이동
                    setScreenMode("new");
                  }}
                  className="w-36 h-36 bg-blue-500 rounded-xl flex flex-col items-center justify-center shadow-lg hover:bg-blue-600"
                >
                  <span className="text-5xl">➕</span>
                  <span className="mt-2 text-base">신규 환자</span>
                </button>
                <button
                  onClick={() => {
                    // 메뉴에서 '기존 환자' 클릭해도 우선은 신규 설정 화면으로 이동 (필요 시 로직 추가)
                    setScreenMode("new");
                  }}
                  className="w-36 h-36 bg-green-500 rounded-xl flex flex-col items-center justify-center shadow-lg hover:bg-green-600"
                >
                  <span className="text-5xl">▶️</span>
                  <span className="mt-2 text-base">기존 환자</span>
                </button>
              </div>
            )}

            {/** ────────────────────────────────────────────────────────────────────
             * 2-2) 신규 환자 설정 화면
             * ──────────────────────────────────────────────────────────────────── */}
            {screenMode === "new" && (
              <div className="w-full h-full px-4 py-6 flex flex-col items-center">
                <h2 className="text-2xl mb-6">환자 설정</h2>
                <div className="w-full max-w-md space-y-4">
                  {/* 환자 ID 입력 */}
                  <div className="flex flex-col">
                    <label className="mb-1">
                      환자 ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={patientId}
                      onChange={(e) => {
                        setPatientId(e.target.value);
                        if (e.target.value.trim() !== "") {
                          setPatientError("");
                        }
                      }}
                      className="rounded-lg px-3 py-2 text-black"
                      placeholder="예: 000001"
                    />
                    {patientError && (
                      <p className="mt-1 text-sm text-red-400">{patientError}</p>
                    )}
                  </div>

                  {/* 침상 번호 입력 */}
                  <div className="flex flex-col">
                    <label className="mb-1">
                      침상 번호 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bedNo}
                      onChange={(e) => {
                        setBedNo(e.target.value);
                        if (e.target.value.trim() !== "") {
                          setBedError("");
                        }
                      }}
                      className="rounded-lg px-3 py-2 text-black"
                      placeholder="예: 101"
                    />
                    {bedError && (
                      <p className="mt-1 text-sm text-red-400">{bedError}</p>
                    )}
                  </div>

                  {/* 치료 모드 선택 */}
                  <div className="flex flex-col">
                    <label className="mb-1">치료 모드</label>
                    <select
                      value={mode}
                      onChange={(e) => setMode(e.target.value)}
                      className="rounded-lg px-3 py-2 bg-gray-800"
                    >
                      <option value="HF">HF</option>
                      <option value="CPAP">CPAP</option>
                      <option value="bi-level">bi-level</option>
                    </select>
                  </div>

                  {/** HF 모드일 때 캐뉼라 교정, CPAP/bi-level일 때 서킷 교정 버튼 */}
                  <div className="mt-4">
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

                  {/** “다음” / “뒤로” 버튼 **/}
                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={() => {
                        // “다음” 버튼을 눌렀을 때도 반드시 입력 검증
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
                </div>

                {/** 타입 선택 모달 **/}
                {showTypeModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-xl w-80 p-6 space-y-4">
                      <h3 className="text-white text-lg">캐뉼라 유형 선택</h3>
                      <p className="text-gray-300 text-sm">
                        1. 캐뉼라 유형을 선택하십시오.
                      </p>
                      <div className="flex justify-between mt-4">
                        <button
                          onClick={() => selectCalibType("캐뉼라")}
                          className="flex-1 mx-1 bg-blue-600 py-2 rounded-lg text-white hover:bg-blue-700"
                        >
                          캐뉼라
                        </button>
                        <button
                          onClick={() => selectCalibType("T-piece")}
                          className="flex-1 mx-1 bg-blue-600 py-2 rounded-lg text-white hover:bg-blue-700"
                        >
                          T-piece
                        </button>
                      </div>
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => setShowTypeModal(false)}
                          className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/** 안내(Instruction) 팝업 **/}
                {showInstructionModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-xl w-80 p-6 space-y-4">
                      <h3 className="text-white text-lg">교정 진행 시 주의사항</h3>
                      <ul className="text-gray-300 text-sm list-decimal list-inside space-y-1">
                        <li>
                          박테리아 필터, 가습 챔버, 서킷과 캐뉼라를 올바르게 장착하십시오.
                        </li>
                        <li>
                          서킷, 캐뉼라, 에어 홀이 막히지 않도록 하십시오.
                        </li>
                        <li>
                          교정 진행 중에 장치 및 서킷 또는 캐뉼라를 움직이지 마십시오.
                        </li>
                      </ul>
                      <div className="mt-4 flex justify-center gap-4">
                        <button
                          onClick={handleInstructionConfirm}
                          className="flex-1 bg-green-600 py-2 rounded-lg text-white hover:bg-green-700"
                        >
                          확인
                        </button>
                        <button
                          onClick={() => {
                            setShowInstructionModal(false);
                            setScreenMode("new");
                          }}
                          className="flex-1 bg-gray-600 py-2 rounded-lg text-white hover:bg-gray-500"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/** ────────────────────────────────────────────────────────────────────
             * 2-3) 파라미터 입력 화면
             * ──────────────────────────────────────────────────────────────────── */}
            {screenMode === "settings" && (
              <div className="w-full h-full px-4 py-6 flex flex-col items-center overflow-auto">
                <h2 className="text-2xl mb-6">HF 기능 설정 파라미터</h2>
                <div className="w-full max-w-md space-y-6">
                  {/* 치료 모드 표시 및 변경 */}
                  <div className="flex flex-col">
                    <label className="mb-1">치료 모드</label>
                    <select
                      value={mode}
                      onChange={(e) => setMode(e.target.value)}
                      className="rounded-lg px-3 py-2 bg-gray-800"
                    >
                      <option value="HF">HF</option>
                      <option value="CPAP">CPAP</option>
                      <option value="bi-level">bi-level</option>
                    </select>
                  </div>

                  {/* 유량 (Flow) */}
                  <div className="flex flex-col">
                    <label className="mb-1">유량 (LPM)</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={decFlow}
                        className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                      >
                        –
                      </button>
                      <span className="text-xl w-12 text-center">
                        {flow.toFixed(0)}
                      </span>
                      <button
                        onClick={incFlow}
                        className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">1 ~ 60 LPM</p>
                  </div>

                  {/* FiO₂ (%) */}
                  <div className="flex flex-col">
                    <label className="mb-1">FiO₂ (%)</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={decFiO2}
                        className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                      >
                        –
                      </button>
                      <span className="text-xl w-12 text-center">{fio2}%</span>
                      <button
                        onClick={incFiO2}
                        className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">21% ~ 100%</p>
                  </div>

                  {/* Dew Point (℃) */}
                  <div className="flex flex-col">
                    <label className="mb-1">Dew Point (℃)</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={decDew}
                        className={`p-2 rounded-lg ${
                          mode === "HF"
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-gray-800 cursor-not-allowed"
                        }`}
                        disabled={mode !== "HF"}
                      >
                        –
                      </button>
                      <span className="text-xl w-12 text-center">
                        {mode === "HF" ? dewPoint : "--"}
                      </span>
                      <button
                        onClick={incDew}
                        className={`p-2 rounded-lg ${
                          mode === "HF"
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-gray-800 cursor-not-allowed"
                        }`}
                        disabled={mode !== "HF"}
                      >
                        +
                      </button>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">
                      {mode === "HF"
                        ? "31℃ ~ 37℃"
                        : "CPAP/bi-level 모드 시 비활성"}
                    </p>
                  </div>

                  {/* 가습 레벨 */}
                  <div className="flex flex-col">
                    <label className="mb-1">가습 레벨</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={decHumid}
                        className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                      >
                        –
                      </button>
                      <span className="text-xl w-12 text-center">
                        {humidLevel}
                      </span>
                      <button
                        onClick={incHumid}
                        className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">1 ~ 5</p>
                  </div>

                  {/* 치료 시작 / 종료 버튼 */}
                  <div className="mt-6">
                    {isStarted ? (
                      <button
                        onClick={openStopPopup}
                        className="w-full bg-red-600 py-3 rounded-lg hover:bg-red-700"
                      >
                        치료 종료
                      </button>
                    ) : (
                      <button
                        onClick={openStartPopup}
                        className="w-full bg-green-600 py-3 rounded-lg hover:bg-green-700"
                      >
                        치료 시작
                      </button>
                    )}
                  </div>

                  {/* 뒤로 버튼 (신규 환자 설정 화면으로 돌아가기) */}
                  <div className="mt-4">
                    <button
                      onClick={() => setScreenMode("new")}
                      className="w-full bg-gray-700 py-3 rounded-lg hover:bg-gray-600"
                    >
                      뒤로
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/** ──────────────────────────────────────────────────────────────────────────
       * 우측: 전원 버튼 + 다이얼 버튼 (기능 추가)
       * ────────────────────────────────────────────────────────────────────────── */}
      <div className="flex-initial w-full md:w-36 bg-gray-800 flex flex-col items-center justify-center space-y-8 py-8">
        {/* 전원 버튼 */}
        <button
          onClick={handlePowerToggle}
          className={`w-16 h-16 flex items-center justify-center rounded-full border-2 
            ${isPowerOn ? "border-green-400 bg-gray-900 hover:bg-gray-800" : "border-red-400 bg-gray-900 hover:bg-gray-800"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-8 h-8 ${isPowerOn ? "text-green-400" : "text-red-400"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v9m0 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
          </svg>
        </button>

        {/* 다이얼 버튼 (크기 확대 + 드래그/클릭 기능) */}
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
          {/* 다이얼 중심부 */}
          <div className="w-12 h-12 rounded-full bg-gray-500"></div>
        </div>
      </div>

      {/** ──────────────────────────────────────────────────────────────────────────
       * 치료 시작/종료 확인 팝업
       * ────────────────────────────────────────────────────────────────────────── */}
      {confirmPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl text-center w-80">
            <p className="mb-4 text-white">
              치료를 {confirmPopup === "start" ? "시작" : "종료"}하시겠습니까?
            </p>
            <div className="flex justify-center gap-6">
              <button
                onClick={handleConfirmPopup}
                className="flex-1 bg-blue-600 py-2 rounded-lg text-white hover:bg-blue-700"
              >
                확인
              </button>
              <button
                onClick={() => setConfirmPopup("")}
                className="flex-1 bg-gray-600 py-2 rounded-lg text-white hover:bg-gray-500"
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
