import React, { useState } from 'react';

export default function App() {
  const [step, setStep] = useState('menu'); // menu, new, existing
  const [mode, setMode] = useState(null); // HF, CPAP, BI
  const [showConfirm, setShowConfirm] = useState(false);
  const [parameter, setParameter] = useState(null);
  const [settings, setSettings] = useState({
    flow: 0,
    fio2: 0,
    dew: 0,
    humidity: 0,
  });

  const handleModeChange = (selectedMode) => {
    setMode(selectedMode);
    setShowConfirm(true);
  };

  const updateParam = (key, delta) => {
    setSettings((prev) => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-sm">
      {step === 'menu' && (
        <div className="grid gap-4">
          <h1 className="text-xl font-bold text-center mb-2">환자 선택</h1>
          <div className="flex justify-around">
            <button
              className="border-4 border-green-500 rounded-xl px-4 py-2 bg-white"
              onClick={() => setStep('new')}
            >
              신규환자
            </button>
            <button
              className="border-4 border-green-500 rounded-xl px-4 py-2 bg-white"
              onClick={() => setStep('existing')}
            >
              기존환자
            </button>
          </div>
        </div>
      )}

      {step === 'new' && (
        <div className="grid gap-4">
          <div>
            <label>환자 ID:</label>
            <input className="border p-1 w-full" />
          </div>
          <div>
            <label>침상 번호:</label>
            <input className="border p-1 w-full" />
          </div>

          <div>
            <h2 className="font-bold mt-4">치료모드 선택</h2>
            <div className="flex justify-around">
              {['HF', 'CPAP', 'BI'].map((m) => (
                <button
                  key={m}
                  onClick={() => handleModeChange(m)}
                  className={`px-4 py-2 border rounded ${
                    mode === m ? 'bg-green-300' : 'bg-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {showConfirm && (
            <div className="border p-4 bg-white shadow">
              <p>치료 모드로 변경하시겠습니까?</p>
              <div className="flex gap-2 mt-2 justify-end">
                <button
                  className="px-3 py-1 bg-gray-200"
                  onClick={() => setShowConfirm(false)}
                >
                  취소
                </button>
                <button
                  className="px-3 py-1 bg-blue-400 text-white"
                  onClick={() => setShowConfirm(false)}
                >
                  확인
                </button>
              </div>
            </div>
          )}

          {mode && (
            <div className="border-t mt-4 pt-4">
              {mode === 'HF' && (
                <div>
                  <p className="font-semibold">캐뉼라 교정</p>
                  <select className="border p-1 w-full mt-1">
                    <option>소형</option>
                    <option>중형</option>
                    <option>대형</option>
                  </select>
                </div>
              )}
              {(mode === 'CPAP' || mode === 'BI') && (
                <div>
                  <p className="font-semibold">서킷 교정</p>
                </div>
              )}

              <h3 className="font-bold mt-4">치료 파라미터 설정</h3>
              {[
                ['flow', '유량'],
                ['fio2', 'FiO2'],
                ['dew', 'Dew Point'],
                ['humidity', '가습 레벨'],
              ].map(([key, label]) => (
                <div key={key} className="flex items-center justify-between my-1">
                  <span>{label}</span>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 bg-gray-200 rounded"
                      onClick={() => updateParam(key, -1)}
                    >
                      -
                    </button>
                    <span className="w-6 text-center">{settings[key]}</span>
                    <button
                      className="px-2 py-1 bg-gray-200 rounded"
                      onClick={() => updateParam(key, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded"
                  onClick={() => alert('치료를 시작합니다.')}
                >
                  치료 시작
                </button>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  className="text-sm text-red-500"
                  onClick={() => alert('치료를 중지합니다.')}
                >
                  치료 종료
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 'existing' && (
        <div className="text-center">
          <p>기존 환자 모니터링 화면입니다.</p>
        </div>
      )}
    </div>
  );
}
