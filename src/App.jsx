// src/App.jsx
import React, { useState, useRef, useEffect } from "react";
import "./index.css"; // TailwindCSS 적용된 CSS

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
  const [mode, setMode] = useState("HF");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 2-1) 메뉴 화면에서 ← → Enter 키 핸들링
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (screenMode === "menu") {
        if (e.key === "ArrowRight") {
          setSelectedIndex((prev) => (prev + 1) % 2);
        } else if (e.key === "ArrowLeft") {
          setSelectedIndex((prev) => (prev - 1 + 2) % 2);
        } else if (e.key === "Enter") {
          if (selectedIndex === 0) setScreenMode("new");
          else if (selectedIndex === 1) setScreenMode("settings");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [screenMode, selectedIndex]);

  const [patientError, setPatientError] = useState("");
  const [bedError, setBedError] = useState("");

  // 캘리브레이션(캐뉼라/서킷) 팝업
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [calibType, setCalibType] = useState(""); // "캐뉼라" | "T-piece" | "서킷"
  const [showInstructionModal, setShowInstructionModal] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────────
  // 3) HF 기능 설정(파라미터) 화면 상태
  // ─────────────────────────────────────────────────────────────────────────────
  // 페이지 1 → 유량, FiO₂, RR 감지
  // 페이지 2 → Dew Point, 가습 레벨, TSF, Bi-Flow, 시작/중지
  const [settingPage, setSettingPage] = useState(1);

  // “포커스된 카드” (하이라이트 테두리용)
  // "flow" | "fio2" | "rr" | "dew" | "humid" | "tsf" | "biflow" | ""
  const [activeParam, setActiveParam] = useState("");

  // “현재 편집 모드인 파라미터” (값 증감/토글 허용)
  // "" → 편집 꺼짐
  // "flow","fio2","rr","dew","humid","tsf","biflow" → 해당 파라미터 편집 중
  const [editingParam, setEditingParam] = useState("");

  // 파라미터 값들
  const [flow, setFlow] = useState(30);          // 1 ~ 60
  const [fio2, setFio2] = useState(40);          // 21 ~ 100
  const [rrDetect, setRrDetect] = useState(false); // On/Off
  const [dewPoint, setDewPoint] = useState(31);  // 31 ~ 37
  const [humidLevel, setHumidLevel] = useState(3); // 1 ~ 5
  const [tsfOn, setTsfOn] = useState(false);     // On/Off
  const [biFlowOn, setBiFlowOn] = useState(false); // On/Off

  // 치료 시작/종료 팝업
  const [confirmPopup, setConfirmPopup] = useState(""); // "start" | "stop" | ""

  // 치료 중 상태
  const [isStarted, setIsStarted] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────────
  // 4) 포커스 인덱스 및 ref 관리 (다이얼 네비게이션용)
  // ─────────────────────────────────────────────────────────────────────────────
  // 4-1) 신규 환자 화면 포커스
  const [focusIndexNew, setFocusIndexNew] = useState(0);
  const newRefs = {
    patientId: useRef(null),  // index 0
    bedNo: useRef(null),      // index 1
    mode: useRef(null),       // index 2
    calibBtn: useRef(null),   // index 3
    nextBtn: useRef(null),    // index 4
    backBtn: useRef(null),    // index 5
  };

  // 4-2) HF 설정 화면 포커스
  // Page1: flow(0), fio2(1), rr(2)
  // Page2: dew(3), humid(4), tsf(5), biflow(6), startStopBtn(7)
  const [focusIndexSetting, setFocusIndexSetting] = useState(0);
  const settingRefs = {
    flowCard: useRef(null),     // index 0
    fio2Card: useRef(null),     // index 1
    rrCard: useRef(null),       // index 2
    dewCard: useRef(null),      // index 3
    humidCard: useRef(null),    // index 4
    tsfCard: useRef(null),      // index 5
    biflowCard: useRef(null),   // index 6
    startStopBtn: useRef(null), // index 7
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 5) 다이얼(휠) 조작 이벤트 처리
  // ─────────────────────────────────────────────────────────────────────────────
  const [isDialDragging, setIsDialDragging] = useState(false);
  const dragStartX = useRef(0);
  const lastDragX = useRef(0);

  // (1) 다이얼 클릭(한 번 톡! → Enter/클릭으로 동작)
  //     - 메뉴 모드와 신규 환자 모드에서만 동작
  //     - settings 모드일 때는 카드 클릭으로만 편집 모드 토글 / 시작·종료 팝업
  const handleDialClickCommon = () => {
    if (screenMode === "menu") {
      if (selectedIndex === 0) setScreenMode("new");
      else setScreenMode("settings");
      return;
    }
    if (screenMode === "new") {
      switch (focusIndexNew) {
        case 0:
          if (newRefs.patientId.current) newRefs.patientId.current.focus();
          break;
        case 1:
          if (newRefs.bedNo.current) newRefs.bedNo.current.focus();
          break;
        case 2:
          if (newRefs.mode.current) newRefs.mode.current.focus();
          break;
        case 3:
          if (newRefs.calibBtn.current) newRefs.calibBtn.current.click();
          break;
        case 4:
          if (newRefs.nextBtn.current) newRefs.nextBtn.current.click();
          break;
        case 5:
          if (newRefs.backBtn.current) newRefs.backBtn.current.click();
          break;
        default:
          break;
      }
      return;
    }

    if (screenMode === "settings" && editingParam !== "") {
      // 편집 중일 때(single‐click) → “편집 모드 해제”
      setEditingParam("");
      return;
    }
    // settings에서 single‐click일 때는 포커스 이동／팝업 없음
  };

  // (2) 다이얼 좌회전
  const handleDialLeftCommon = () => {
    if (screenMode === "menu") {
      setSelectedIndex((prev) => (prev - 1 + 2) % 2);
      return;
    }
    if (screenMode === "new") {
      setFocusIndexNew((idx) => Math.max(0, idx - 1));
      return;
    }
    if (screenMode === "settings") {
      if (editingParam !== "") {
        // 편집 모드 ON 상태 → 파라미터 값 감소/토글
        switch (editingParam) {
          case "flow":
            setFlow((v) => Math.max(1, v - 1));
            break;
          case "fio2":
            setFio2((v) => Math.max(21, v - 1));
            break;
          case "rr":
            setRrDetect((prev) => !prev);
            break;
          case "dew":
            setDewPoint((v) => Math.max(31, v - 1));
            break;
          case "humid":
            setHumidLevel((v) => Math.max(1, v - 1));
            break;
          case "tsf":
            setTsfOn((prev) => !prev);
            break;
          case "biflow":
            setBiFlowOn((prev) => !prev);
            break;
          default:
            break;
        }
        return;
      }
      // 편집 모드 OFF → 포커스 이동 (페이지별 순환) + activeParam 동기화
      let newIndex;
      if (settingPage === 1) {
        // Page1: indices 0~2
        newIndex = focusIndexSetting - 1 < 0 ? 2 : focusIndexSetting - 1;
      } else {
        // Page2: indices 3~7
        const idx = focusIndexSetting;
        if (idx < 3 || idx > 7) {
          newIndex = 7;
        } else {
          newIndex = idx - 1 < 3 ? 7 : idx - 1;
        }
      }
      setFocusIndexSetting(newIndex);

      // ▲ 여기에서 "activeParam"을 focusIndexSetting에 매핑
      //   0→"flow", 1→"fio2", 2→"rr", 3→"dew", 4→"humid", 5→"tsf", 6→"biflow", 7→""
      switch (newIndex) {
        case 0:
          setActiveParam("flow");
          break;
        case 1:
          setActiveParam("fio2");
          break;
        case 2:
          setActiveParam("rr");
          break;
        case 3:
          setActiveParam("dew");
          break;
        case 4:
          setActiveParam("humid");
          break;
        case 5:
          setActiveParam("tsf");
          break;
        case 6:
          setActiveParam("biflow");
          break;
        case 7:
          // “시작/종료” 버튼일 때는 activeParam=""
          setActiveParam("");
          break;
        default:
          setActiveParam("");
          break;
      }

      return;
    }
  };

  // (3) 다이얼 우회전
  const handleDialRightCommon = () => {
    if (screenMode === "menu") {
      setSelectedIndex((prev) => (prev + 1) % 2);
      return;
    }
    if (screenMode === "new") {
      setFocusIndexNew((idx) => Math.min(5, idx + 1));
      return;
    }
    if (screenMode === "settings") {
      if (editingParam !== "") {
        // 편집 모드 ON 상태 → 파라미터 값 증가/토글
        switch (editingParam) {
          case "flow":
            setFlow((v) => Math.min(60, v + 1));
            break;
          case "fio2":
            setFio2((v) => Math.min(100, v + 1));
            break;
          case "rr":
            setRrDetect((prev) => !prev);
            break;
          case "dew":
            setDewPoint((v) => Math.min(37, v + 1));
            break;
          case "humid":
            setHumidLevel((v) => Math.min(5, v + 1));
            break;
          case "tsf":
            setTsfOn((prev) => !prev);
            break;
          case "biflow":
            setBiFlowOn((prev) => !prev);
            break;
          default:
            break;
        }
        return;
      }
      // 편집 모드 OFF → 포커스 이동 (페이지별 순환) + activeParam 동기화
      let newIndex;
      if (settingPage === 1) {
        // Page1: indices 0~2
        newIndex = focusIndexSetting + 1 > 2 ? 0 : focusIndexSetting + 1;
      } else {
        // Page2: indices 3~7
        const idx = focusIndexSetting;
        if (idx < 3 || idx > 7) {
          newIndex = 3;
        } else {
          newIndex = idx + 1 > 7 ? 3 : idx + 1;
        }
      }
      setFocusIndexSetting(newIndex);

      // ▲ 여기에서 "activeParam"을 focusIndexSetting에 매핑
      switch (newIndex) {
        case 0:
          setActiveParam("flow");
          break;
        case 1:
          setActiveParam("fio2");
          break;
        case 2:
          setActiveParam("rr");
          break;
        case 3:
          setActiveParam("dew");
          break;
        case 4:
          setActiveParam("humid");
          break;
        case 5:
          setActiveParam("tsf");
          break;
        case 6:
          setActiveParam("biflow");
          break;
        case 7:
          // “시작/종료” 버튼일 때는 activeParam=""
          setActiveParam("");
          break;
        default:
          setActiveParam("");
          break;
      }

      return;
    }
  };

  // (4) 다이얼 드래그(←→ 회전 감지)
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
      handleDialRightCommon();
      lastDragX.current = clientX;
    } else if (deltaX < -10) {
      handleDialLeftCommon();
      lastDragX.current = clientX;
    }
  };
  const onDialPointerUp = (e) => {
    if (!isDialDragging) return;
    setIsDialDragging(false);
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const totalDelta = clientX - dragStartX.current;
    if (Math.abs(totalDelta) < 5) {
      // 클릭으로 간주
      if (screenMode === "menu" || screenMode === "new") {
        handleDialClickCommon();
      } else if (screenMode === "settings" && editingParam !== "") {
        // settings에서 편집 모드일 때 single‐click → 편집 모드 해제
        setEditingParam("");
      }
      // settings에서 편집 OFF 상태면 single‐click 무시
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 6) 전원 버튼 클릭 (OFF ↔ ON)
  // ─────────────────────────────────────────────────────────────────────────────
  const handlePowerToggle = () => {
    if (isPowerOn) {
      // 전원 끄기: 모든 상태 초기화
      setIsPowerOn(false);
      setScreenMode("off");

      // 신규 환자 입력 초기화
      setPatientId("");
      setBedNo("");
      setMode("HF");
      setPatientError("");
      setBedError("");
      setShowTypeModal(false);
      setCalibType("");
      setShowInstructionModal(false);

      // HF 설정 초기화
      setSettingPage(1);
      setActiveParam("");
      setEditingParam("");
      setFlow(30);
      setFio2(40);
      setRrDetect(false);
      setDewPoint(31);
      setHumidLevel(3);
      setTsfOn(false);
      setBiFlowOn(false);

      setConfirmPopup("");
      setIsStarted(false);

      // 포커스 인덱스 초기화
      setFocusIndexNew(0);
      setFocusIndexSetting(0);
    } else {
      // 전원 켜기 → 메뉴 화면
      setIsPowerOn(true);
      setScreenMode("menu");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 7) 치료 시작/종료 팝업 로직
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
  // 8) 환자 정보 입력 검증
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
  // 9) 캘리브레이션(캐뉼라/서킷) 버튼 클릭
  // ─────────────────────────────────────────────────────────────────────────────
  const handleCalibButton = () => {
    if (validatePatientFields()) {
      setShowTypeModal(true);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 10) 캘리브레이션 타입 선택 → 안내 팝업
  // ─────────────────────────────────────────────────────────────────────────────
  const selectCalibType = (type) => {
    setCalibType(type); // "캐뉼라" | "T-piece" | "서킷"
    setShowTypeModal(false);
    setShowInstructionModal(true);
  };
  const handleInstructionConfirm = () => {
    setShowInstructionModal(false);
    // (자동으로 Settings로 넘어가는 코드를 제거했습니다.
    //  다음 버튼을 눌러야만 settings 화면으로 진입)
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 11) “포커스된 요소”에 시각적 테두리 주기
  // ─────────────────────────────────────────────────────────────────────────────
  // 11-1) 신규 환자 화면 포커스
  useEffect(() => {
    if (screenMode === "new") {
      // 모든 테두리 지우기
      Object.values(newRefs).forEach((r) => {
        if (r.current) {
          r.current.classList.remove("ring-2", "ring-green-400");
        }
      });
      // focusIndexNew에 해당하는 ref만 녹색 테두리
      const keys = Object.keys(newRefs);
      const targetKey = keys[focusIndexNew];
      const targetRef = newRefs[targetKey];
      if (targetRef && targetRef.current) {
        targetRef.current.classList.add("ring-2", "ring-green-400");
        // 입력창인 경우 포커스 강제 이동
        if (focusIndexNew === 0) {
          newRefs.patientId.current.focus();
        }
        if (focusIndexNew === 1) {
          newRefs.bedNo.current.focus();
        }
        if (focusIndexNew === 2) {
          newRefs.mode.current.focus();
        }
      }
    }
  }, [focusIndexNew, screenMode]);

  // 11-2) HF 설정 화면 포커스 & 편집 모드 테두리
  useEffect(() => {
    if (screenMode === "settings") {
      // (A) 모든 테두리 초기화
      Object.values(settingRefs).forEach((r) => {
        if (r.current) {
          r.current.classList.remove(
            "ring-2",
            "ring-green-400",
            "ring-blue-400"
          );
        }
      });

      const keys = Object.keys(settingRefs);

      // (B) focusIndexSetting 범위 확인
      if (focusIndexSetting >= 0 && focusIndexSetting < keys.length) {
        const targetKey = keys[focusIndexSetting];
        const targetRef = settingRefs[targetKey];

        // Page1: flowCard, fio2Card, rrCard
        const validOnPage1 = ["flowCard", "fio2Card", "rrCard"];
        // Page2: dewCard, humidCard, tsfCard, biflowCard, startStopBtn
        const validOnPage2 = [
          "dewCard",
          "humidCard",
          "tsfCard",
          "biflowCard",
          "startStopBtn",
        ];

        // (C) Page별로 “포커스 가능한 요소”인지 확인
        if (
          (settingPage === 1 && validOnPage1.includes(targetKey)) ||
          (settingPage === 2 && validOnPage2.includes(targetKey))
        ) {
          if (targetRef && targetRef.current) {
            // (1) 편집 모드가 ON(activeParam===key && editingParam===key)일 때: 파란 테두리
            const paramName = targetKey.replace("Card", "");
            if (
              editingParam !== "" &&
              activeParam === paramName &&
              editingParam === paramName
            ) {
              targetRef.current.classList.add("ring-2", "ring-blue-400");
            }
            // (2) 편집 모드 OFF & “포커스된 카드”(activeParam===key)인 경우: 녹색 테두리
            else if (
              editingParam === "" &&
              activeParam === paramName
            ) {
              targetRef.current.classList.add("ring-2", "ring-green-400");
            }
            // (3) “시작/종료” 버튼(index 7)일 때: focusIndexSetting===7이면 녹색 테두리
            else if (
              focusIndexSetting === 7 &&
              targetKey === "startStopBtn"
            ) {
              targetRef.current.classList.add("ring-2", "ring-green-400");
            }
          }
        }
      }
    }
  }, [
    focusIndexSetting,
    screenMode,
    settingPage,
    activeParam,
    editingParam,
  ]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 12) 화면 렌더링
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 overflow-hidden">
      {/**────────────────────────────────────────────────────────────────────
       * 좌측: 화면 전환 영역 (OFF / MENU / NEW / SETTINGS)
       **/}
      <div className="flex-1 bg-black text-white flex flex-col">
        {/* 화면 OFF */}
        {screenMode === "off" && (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-500 text-lg">화면이 꺼져 있습니다.</p>
          </div>
        )}

        {/* 전원 ON 상태 */}
        {screenMode !== "off" && (
          <>
            {/**────────────────────────────────────────────────────────────────
             * 2-1) 메뉴 화면 (신규 환자 / 기존 환자)
             **/}
            {screenMode === "menu" && (
              <div className="w-full h-full flex flex-row items-center justify-center gap-10 p-4">
                <button
                  onClick={() => setScreenMode("new")}
                  className={`w-36 h-36 bg-[#111827] rounded-xl flex flex-col items-center justify-center shadow-lg ${selectedIndex === 0
                    ? "border-4 border-green-400"
                    : "border-none"
                    }`}
                >
                  <span className="text-cyan-400 text-5xl">＋</span>
                  <span className="mt-2 text-white text-base">신규 환자</span>
                </button>
                <button
                  onClick={() => setScreenMode("settings")}
                  className={`w-36 h-36 bg-[#111827] rounded-xl flex flex-col items-center justify-center shadow-lg ${selectedIndex === 1
                    ? "border-4 border-green-400"
                    : "border-none"
                    }`}
                >
                  <span className="text-cyan-400 text-5xl">▶</span>
                  <span className="mt-2 text-white text-base">기존 환자</span>
                </button>
              </div>
            )}

            {/**────────────────────────────────────────────────────────────────
             * 2-2) 신규 환자 설정 화면
             **/}
            {screenMode === "new" && (
              <div className="flex w-full h-full overflow-hidden">
                {/** [A] 좌측 네비게이션 (삭제됨) **/}
                <div className="w-0" />

                {/** [B] 환자 설정 박스 **/}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl mb-6 text-white">환자 설정</h2>

                    {/** [B-1] 맨 위 3개 입력 요소: “환자 ID”, “침상 번호”, “치료 모드” **/}
                    <div className="flex justify-between mb-8 space-x-4">
                      {/* ■ 환자 ID */}
                      <div
                        ref={newRefs.patientId}
                        onClick={() => setFocusIndexNew(0)}
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col cursor-pointer"
                      >
                        <div className="text-gray-400 text-sm mb-1">
                          환자 ID
                        </div>
                        <input
                          type="text"
                          value={patientId}
                          onFocus={() => setFocusIndexNew(0)}
                          onChange={(e) => {
                            setPatientId(e.target.value);
                            if (e.target.value.trim() !== "") {
                              setPatientError("");
                            }
                          }}
                          className="mt-auto rounded bg-gray-900 text-white px-2 py-1 text-lg focus:outline-none"
                          placeholder="예: 000001"
                        />
                        {patientError && (
                          <p className="mt-1 text-xs text-red-400">
                            {patientError}
                          </p>
                        )}
                      </div>

                      {/* ■ 침상 번호 */}
                      <div
                        ref={newRefs.bedNo}
                        onClick={() => setFocusIndexNew(1)}
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col cursor-pointer"
                      >
                        <div className="text-gray-400 text-sm mb-1">
                          침상 번호
                        </div>
                        <input
                          type="text"
                          value={bedNo}
                          onFocus={() => setFocusIndexNew(1)}
                          onChange={(e) => {
                            setBedNo(e.target.value);
                            if (e.target.value.trim() !== "") {
                              setBedError("");
                            }
                          }}
                          className="mt-auto rounded bg-gray-900 text-white px-2 py-1 text-lg focus:outline-none"
                          placeholder="예: 101"
                        />
                        {bedError && (
                          <p className="mt-1 text-xs text-red-400">
                            {bedError}
                          </p>
                        )}
                      </div>

                      {/* ■ 치료 모드 */}
                      <div
                        ref={newRefs.mode}
                        onClick={() => setFocusIndexNew(2)}
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col cursor-pointer"
                      >
                        <div className="text-gray-400 text-sm mb-1">
                          치료 모드
                        </div>
                        <select
                          value={mode}
                          onFocus={() => setFocusIndexNew(2)}
                          onChange={(e) => setMode(e.target.value)}
                          className="mt-auto rounded bg-gray-900 text-white px-2 py-1 text-lg focus:outline-none"
                        >
                          <option value="HF">HF</option>
                          <option value="CPAP">CPAP</option>
                          <option value="bi-level">bi-level</option>
                        </select>
                      </div>
                    </div>

                    {/** [B-2] 캘리브레이션(교정) 버튼 **/}
                    <div className="mb-8">
                      <button
                        ref={newRefs.calibBtn}
                        onClick={handleCalibButton}
                        onFocus={() => setFocusIndexNew(3)}
                        onClickCapture={() => setFocusIndexNew(3)}
                        className={`w-full py-3 rounded-lg text-white ${mode === "HF"
                          ? "bg-blue-700 hover:bg-blue-800"
                          : "bg-indigo-700 hover:bg-indigo-800"
                          }`}
                      >
                        {mode === "HF" ? "캐뉼라 교정" : "서킷 교정"}
                      </button>
                    </div>
                  </div>

                  {/** [B-3] “다음” / “뒤로” 버튼 (화면 하단에 고정) **/}
                  <div className="flex gap-4">
                    <button
                      ref={newRefs.nextBtn}
                      onFocus={() => setFocusIndexNew(4)}
                      onClick={() => {
                        if (validatePatientFields()) {
                          setScreenMode("settings");
                          // HF 설정 진입 시 Page1 초기화
                          setSettingPage(1);
                          setFocusIndexSetting(0);
                          setActiveParam("");
                          setEditingParam("");
                        }
                      }}
                      className="flex-1 bg-green-600 py-3 rounded-lg hover:bg-green-700 focus:outline-none"
                    >
                      다음
                    </button>
                    <button
                      ref={newRefs.backBtn}
                      onFocus={() => setFocusIndexNew(5)}
                      onClick={() => setScreenMode("menu")}
                      className="flex-1 bg-gray-700 py-3 rounded-lg hover:bg-gray-600 focus:outline-none"
                    >
                      뒤로
                    </button>
                  </div>
                </div>

                {/** ── 캘리브레이션 타입 선택 모달 ── **/}
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
                              className="flex-1 bg-blue-600 py-2 rounded-lg text-white hover:bg-blue-700 focus:outline-none"
                            >
                              캐뉼라
                            </button>
                            <button
                              onClick={() => selectCalibType("T-piece")}
                              className="flex-1 bg-blue-600 py-2 rounded-lg text-white hover:bg-blue-700 focus:outline-none"
                            >
                              T-piece
                            </button>
                            <button
                              onClick={() => setShowTypeModal(false)}
                              className="flex-1 bg-gray-600 py-2 rounded-lg text-white hover:bg-gray-500 focus:outline-none"
                            >
                              취소
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => selectCalibType("서킷")}
                                className="flex-1 bg-indigo-600 py-2 rounded-lg text-white hover:bg-indigo-700 focus:outline-none"
                              >
                                서킷
                              </button>
                              <button
                                onClick={() => setShowTypeModal(false)}
                              className="flex-1 bg-gray-600 py-2 rounded-lg text-white hover:bg-gray-500 focus:outline-none"
                            >
                              취소
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/** ── 안내(Instruction) 팝업 ── **/}
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
                        <li>
                          교정 진행 중에 장치 및 서킷 또는 캐뉼라를 움직이지 마십시오.
                        </li>
                      </ul>
                      <div className="mt-4 flex justify-center gap-4">
                        <button
                          onClick={handleInstructionConfirm}
                          className="flex-1 bg-green-600 py-2 rounded-lg text-white hover:bg-green-700 focus:outline-none"
                        >
                          확인
                        </button>
                        <button
                          onClick={() => {
                            setShowInstructionModal(false);
                            setScreenMode("new");
                          }}
                          className="flex-1 bg-gray-600 py-2 rounded-lg text-white hover:bg-gray-500 focus:outline-none"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/**────────────────────────────────────────────────────────────────
             * 2-3) HF 기능 설정 파라미터 화면 (settings 모드)
             **/}
            {screenMode === "settings" && (
              <div className="flex w-full h-full">
                {/** [A] 좌측 페이징 메뉴 (↑ / 페이지번호 / ↓) **/}
                <div className="w-20 bg-gray-800 flex flex-col items-center py-8 space-y-4">
                  <button
                    onClick={() => {
                      setSettingPage((p) => {
                        const prevPage = Math.max(1, p - 1);
                        if (prevPage === 1) {
                          // Page1 복귀 시 → 포커스=0, 편집모드 초기화
                          setFocusIndexSetting(0);
                          setActiveParam("");
                          setEditingParam("");
                        }
                        return prevPage;
                      });
                    }}
                    className="text-3xl text-gray-400 hover:text-white focus:outline-none"
                  >
                    ↑
                  </button>
                  <div className="text-white text-lg">
                    {settingPage} / 2
                  </div>
                  <button
                    onClick={() => {
                      setSettingPage((p) => {
                        const nextPage = Math.min(2, p + 1);
                        if (nextPage === 2) {
                          // Page2 진입 시 → 포커스=3, 편집모드 초기화
                          setFocusIndexSetting(3);
                          setActiveParam("");
                          setEditingParam("");
                        }
                        return nextPage;
                      });
                    }}
                    className="text-3xl text-gray-400 hover:text-white focus:outline-none"
                  >
                    ↓
                  </button>
                </div>

                {/** [B] 파라미터 카드 + 시작/중지 버튼 **/}
                <div className="flex-1 p-4 flex flex-col justify-between pb-4">
                  <div>
                    <h2 className="text-2xl mb-6 text-white">
                      HF 기능 설정 파라미터
                    </h2>

                    {/** Page 1: 유량 / FiO₂ / RR 감지 **/}
                    {settingPage === 1 && (
                      <div className="grid grid-cols-2 gap-6 w-full max-w-2xl mx-auto mb-6">
                        {/* ■ 유량(Flow) 카드 (index 0) */}
                        <div
                          ref={settingRefs.flowCard}
                          onClick={() => {
                            // □ 편집 모드 토글
                            if (editingParam === "flow") {
                              setEditingParam("");
                            } else {
                              setActiveParam("flow");
                              setEditingParam("flow");
                            }
                            // □ 포커스 인덱스 지정
                            setFocusIndexSetting(0);
                          }}
                          className={`relative bg-gray-800 border ${activeParam === "flow"
                            ? "border-green-400"
                            : "border-gray-700"
                            } rounded-lg p-4 flex flex-col cursor-pointer ${editingParam === "flow"
                              ? "ring-2 ring-blue-400"
                              : ""
                            }`}
                        >
                          <div className="text-gray-400 text-sm mb-1">
                            유량 (LPM)
                          </div>
                          <div className="flex items-baseline justify-center">
                            <span className="text-5xl font-bold">{flow}</span>
                            <span className="text-xl text-gray-400 ml-2">
                              LPM
                            </span>
                          </div>
                          <div className="absolute bottom-2 right-4 text-xs text-gray-500">
                            1&nbsp;~&nbsp;60
                          </div>
                        </div>

                        {/* ■ FiO₂ 카드 (index 1) */}
                        <div
                          ref={settingRefs.fio2Card}
                          onClick={() => {
                            if (editingParam === "fio2") {
                              setEditingParam("");
                            } else {
                              setActiveParam("fio2");
                              setEditingParam("fio2");
                            }
                            setFocusIndexSetting(1);
                          }}
                          className={`relative bg-gray-800 border ${activeParam === "fio2"
                            ? "border-green-400"
                            : "border-gray-700"
                            } rounded-lg p-4 flex flex-col cursor-pointer ${editingParam === "fio2"
                              ? "ring-2 ring-blue-400"
                              : ""
                            }`}
                        >
                          <div className="text-gray-400 text-sm mb-1">
                            FiO₂ (%)
                          </div>
                          <div className="flex items-baseline justify-center">
                            <span className="text-5xl font-bold">{fio2}</span>
                            <span className="text-xl text-gray-400 ml-2">
                              %
                            </span>
                          </div>
                          <div className="absolute bottom-2 right-4 text-xs text-gray-500">
                            21&nbsp;~&nbsp;100
                          </div>
                        </div>

                        {/* ■ RR 감지(On/Off) 카드 (index 2, 두 열 차지) */}
                        <div
                          ref={settingRefs.rrCard}
                          onClick={() => {
                            if (editingParam === "rr") {
                              setEditingParam("");
                            } else {
                              setActiveParam("rr");
                              setEditingParam("rr");
                            }
                            setFocusIndexSetting(2);
                          }}
                          className={`col-span-2 relative bg-gray-800 border ${activeParam === "rr"
                            ? "border-green-400"
                            : "border-gray-700"
                            } rounded-lg p-4 flex flex-col items-center cursor-pointer ${editingParam === "rr"
                              ? "ring-2 ring-blue-400"
                              : ""
                            }`}
                        >
                          <div className="text-gray-400 text-sm mb-1">
                            RR 감지
                          </div>
                          <div className="text-5xl font-bold">
                            {rrDetect ? "켜짐" : "꺼짐"}
                          </div>
                        </div>
                      </div>
                    )}

                    {/** Page 2: Dew Point / 가습 레벨 / TSF(On/Off) / Bi-Flow(On/Off) **/}
                    {settingPage === 2 && (
                      <div className="grid grid-cols-2 gap-6 w-full max-w-2xl mx-auto mb-6">
                        {/* ■ Dew Point 카드 (index 3) */}
                        <div
                          ref={settingRefs.dewCard}
                          onClick={() => {
                            if (editingParam === "dew") {
                              setEditingParam("");
                            } else {
                              setActiveParam("dew");
                              setEditingParam("dew");
                            }
                            setFocusIndexSetting(3);
                          }}
                          className={`relative bg-gray-800 border ${activeParam === "dew"
                            ? "border-green-400"
                            : "border-gray-700"
                            } rounded-lg p-4 flex flex-col cursor-pointer ${editingParam === "dew"
                              ? "ring-2 ring-blue-400"
                              : ""
                            }`}
                        >
                          <div className="text-gray-400 text-sm mb-1">
                            Dew Point (℃)
                          </div>
                          <div className="flex items-baseline justify-center">
                            <span className="text-5xl font-bold">
                              {dewPoint}
                            </span>
                            <span className="text-xl text-gray-400 ml-2">
                              ℃
                            </span>
                          </div>
                          <div className="absolute bottom-2 right-4 text-xs text-gray-500">
                            31&nbsp;~&nbsp;37
                          </div>
                        </div>

                        {/* ■ 가습 레벨 카드 (index 4) */}
                        <div
                          ref={settingRefs.humidCard}
                          onClick={() => {
                            if (editingParam === "humid") {
                              setEditingParam("");
                            } else {
                              setActiveParam("humid");
                              setEditingParam("humid");
                            }
                            setFocusIndexSetting(4);
                          }}
                          className={`relative bg-gray-800 border ${activeParam === "humid"
                            ? "border-green-400"
                            : "border-gray-700"
                            } rounded-lg p-4 flex flex-col cursor-pointer ${editingParam === "humid"
                              ? "ring-2 ring-blue-400"
                              : ""
                            }`}
                        >
                          <div className="text-gray-400 text-sm mb-1">
                            가습 레벨
                          </div>
                          <div className="flex items-baseline justify-center">
                            <span className="text-5xl font-bold">
                              {humidLevel}
                            </span>
                          </div>
                          <div className="absolute bottom-2 right-4 text-xs text-gray-500">
                            1&nbsp;~&nbsp;5
                          </div>
                        </div>

                        {/* ■ TSF(On/Off) 카드 (index 5) */}
                        <div
                          ref={settingRefs.tsfCard}
                          onClick={() => {
                            if (editingParam === "tsf") {
                              setEditingParam("");
                            } else {
                              setActiveParam("tsf");
                              setEditingParam("tsf");
                            }
                            setFocusIndexSetting(5);
                          }}
                          className={`relative bg-gray-800 border ${activeParam === "tsf"
                            ? "border-green-400"
                            : "border-gray-700"
                            } rounded-lg p-4 flex flex-col cursor-pointer ${editingParam === "tsf"
                              ? "ring-2 ring-blue-400"
                              : ""
                            }`}
                        >
                          <div className="text-gray-400 text-sm mb-1">
                            TSF (옵션)
                          </div>
                          <div className="text-5xl font-bold">
                            {tsfOn ? "켜짐" : "꺼짐"}
                          </div>
                        </div>

                        {/* ■ Bi-Flow(On/Off) 카드 (index 6) */}
                        <div
                          ref={settingRefs.biflowCard}
                          onClick={() => {
                            if (editingParam === "biflow") {
                              setEditingParam("");
                            } else {
                              setActiveParam("biflow");
                              setEditingParam("biflow");
                            }
                            setFocusIndexSetting(6);
                          }}
                          className={`relative bg-gray-800 border ${activeParam === "biflow"
                            ? "border-green-400"
                            : "border-gray-700"
                            } rounded-lg p-4 flex flex-col cursor-pointer ${editingParam === "biflow"
                              ? "ring-2 ring-blue-400"
                              : ""
                            }`}
                        >
                          <div className="text-gray-400 text-sm mb-1">
                            Bi-Flow (옵션)
                          </div>
                          <div className="text-5xl font-bold">
                            {biFlowOn ? "켜짐" : "꺼짐"}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/** [C] 단일 액션 버튼: “치료 시작” ⇄ “치료 종료” (화면 아래 고정) **/}
                  <div className="w-full max-w-2xl mx-auto">
                    <button
                      ref={settingRefs.startStopBtn}
                      onClick={() => {
                        if (isStarted) openStopPopup();
                        else openStartPopup();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          if (isStarted) openStopPopup();
                          else openStartPopup();
                        }
                      }}
                      className={`w-full py-4 rounded-lg flex items-center justify-center text-white focus:outline-none ${isStarted
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                        }`}
                    >
                      {isStarted ? (
                        <span className="flex items-center gap-2 text-xl font-semibold">
                          <span>중지</span>
                          <span className="text-2xl">▇</span>
                        </span>
                      ) : (
                          <span className="flex items-center gap-2 text-xl font-semibold">
                            <span>시작</span>
                          <span className="text-2xl">▶</span>
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

      {/**────────────────────────────────────────────────────────────────────
       * 우측: 전원 버튼 + 다이얼 버튼
       **/}
      <div className="flex-initial w-full md:w-36 bg-gray-800 flex flex-col items-center justify-center space-y-8 py-8">
        {/* 전원 버튼 */}
        <button
          onClick={handlePowerToggle}
          className={`w-16 h-16 flex items-center justify-center rounded-full border-2 ${
            isPowerOn
              ? "border-green-400 bg-gray-900 hover:bg-gray-800"
              : "border-red-400 bg-gray-900 hover:bg-gray-800"
            } focus:outline-none`}
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
          onMouseDown={onDialPointerDown}
          onMouseMove={onDialPointerMove}
          onMouseUp={onDialPointerUp}
          onMouseLeave={onDialPointerUp}
          onTouchStart={onDialPointerDown}
          onTouchMove={onDialPointerMove}
          onTouchEnd={onDialPointerUp}
          className="relative w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center touch-action-none focus:outline-none"
        >
          {/* 다이얼 링 */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-600"></div>
          {/* 다이얼 중앙부 */}
          <div className="w-12 h-12 rounded-full bg-gray-500"></div>
        </div>
      </div>

      {/**────────────────────────────────────────────────────────────────────
       * 치료 시작/종료 확인 팝업
       **/}
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
                className="flex-1 bg-blue-600 py-2 rounded-lg text-white hover:bg-blue-700 focus:outline-none"
              >
                확인
              </button>
              <button
                onClick={() => setConfirmPopup("")}
                className="flex-1 bg-gray-600 py-2 rounded-lg text-white hover:bg-gray-500 focus:outline-none"
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
