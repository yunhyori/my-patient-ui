// my-patient-ui/src/App.jsx
import React, { useState } from "react";

export default function PatientFlowUI() {
  const [screen, setScreen] = useState("menu");
  const [patientId, setPatientId] = useState("");
  const [bedNo, setBedNo] = useState("");
  const [mode, setMode] = useState("HF");
  const [flow, setFlow] = useState(30);
  const [fio2, setFio2] = useState(40);
  const [dewPoint, setDewPoint] = useState(37);
  const [humidLevel, setHumidLevel] = useState(3);
  const [confirmPopup, setConfirmPopup] = useState("");
  const [isStarted, setIsStarted] = useState(false);

  const startTreatment = () => setConfirmPopup("start");
  const stopTreatment = () => setConfirmPopup("stop");

  const confirmAction = () => {
    if (confirmPopup === "start") setIsStarted(true);
    if (confirmPopup === "stop") setIsStarted(false);
    setConfirmPopup("");
  };

  return (
    <div className="bg-black text-white min-h-screen p-6">
      {/* 메뉴 화면 */}
      {screen === "menu" && (
        <div className="flex gap-10 justify-center">
          <button
            onClick={() => setScreen("new")}
            className="bg-blue-500 w-40 h-40 rounded-lg flex flex-col justify-center items-center"
          >
            <div className="text-4xl">➕</div>
            <div className="mt-2">신규 환자</div>
          </button>
          <button
            onClick={() => setScreen("monitor")}
            className="bg-green-500 w-40 h-40 rounded-lg flex flex-col justify-center items-center"
          >
            <div className="text-4xl">▶️</div>
            <div className="mt-2">기존 환자</div>
          </button>
        </div>
      )}

      {/* 신규 환자 설정 화면 */}
      {screen === "new" && (
        <div>
          <h2 className="text-xl mb-4">환자 설정</h2>
          <div className="grid grid-cols-3 gap-4 max-w-xl">
            <div>
              <label>환자 ID</label>
              <input
                className="w-full text-black"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />
            </div>
            <div>
              <label>침상 번호</label>
              <input
                className="w-full text-black"
                value={bedNo}
                onChange={(e) => setBedNo(e.target.value)}
              />
            </div>
            <div>
              <label>치료 모드</label>
              <button
                onClick={() =>
                  setMode(
                    mode === "HF" ? "CPAP" : mode === "CPAP" ? "bi-level" : "HF"
                  )
                }
                className="w-full bg-gray-700 p-2"
              >
                {mode}
              </button>
            </div>
            {mode === "HF" && (
              <div className="col-span-2 bg-blue-900 p-2">
                캐뉼라 교정
              </div>
            )}
            <button
              onClick={() => setScreen("settings")}
              className="col-span-1 bg-green-700 p-2"
            >
              다음
            </button>
          </div>
        </div>
      )}

      {/* 치료 설정 화면 */}
      {screen === "settings" && (
        <div>
          <h2 className="text-xl mb-4">치료 설정</h2>
          <div className="grid grid-cols-2 gap-4 max-w-xl">
            <div>
              <label>유량 (LPM)</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setFlow((f) => f - 1)}>-</button>
                <div>{flow}</div>
                <button onClick={() => setFlow((f) => f + 1)}>+</button>
              </div>
            </div>
            <div>
              <label>FiO₂ (%)</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setFio2((f) => f - 1)}>-</button>
                <div>{fio2}</div>
                <button onClick={() => setFio2((f) => f + 1)}>+</button>
              </div>
            </div>
            <div>
              <label>Dew Point (℃)</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setDewPoint((d) => d - 1)}>-</button>
                <div>{dewPoint}</div>
                <button onClick={() => setDewPoint((d) => d + 1)}>+</button>
              </div>
            </div>
            <div>
              <label>가습 레벨</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setHumidLevel((h) => Math.max(1, h - 1))}>
                  -
                </button>
                <div>{humidLevel}</div>
                <button onClick={() => setHumidLevel((h) => Math.min(5, h + 1))}>
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6">
            {isStarted ? (
              <button
                className="bg-red-700 p-4"
                onClick={stopTreatment}
              >
                종료
              </button>
            ) : (
              <button
                className="bg-green-600 p-4"
                onClick={startTreatment}
              >
                시작
              </button>
            )}
          </div>
        </div>
      )}

      {/* 확인 팝업 */}
      {confirmPopup && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-gray-900 p-6 rounded-xl text-center">
            <p className="mb-4">
              치료를 {confirmPopup === "start" ? "시작" : "종료"}하시겠습니까?
            </p>
            <div className="flex justify-center gap-6">
              <button
                onClick={confirmAction}
                className="bg-blue-600 px-4 py-2"
              >
                확인
              </button>
              <button
                onClick={() => setConfirmPopup("")}
                className="bg-gray-500 px-4 py-2"
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
