// src/components/ScreenUI.jsx
import React from "react";

export default function CalibrationPopups({
  type,
  show,
  mode,
  onOpen,
  onSelect,
  onConfirm,
}) {
  if (!show) return null;

  // 팝업 공통 스타일
  const popupBg = "fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50";
  const popupBox = "bg-gray-900 p-6 rounded-lg max-w-lg w-full text-center";

  // ─────────────────────────────────────────────────────────────────────────────
  // 1) 타입 선택 팝업 (캐뉼라 / 서킷)
  if (type === "typeSelect") {
    return (
      <div className={popupBg}>
        <div className={popupBox}>
          <h3 className="text-xl font-bold mb-4">교정 유형 선택</h3>
          <p className="mb-6">캐뉼라 유형을 선택하세요.</p>
          <div className="flex justify-center gap-4">
            {mode === "HF" ? (
              <>
                <button
                  className="bg-blue-700 text-white px-4 py-2 rounded"
                  onClick={() => onSelect("cannula")}
                >
                  캐뉼라
                </button>
                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded"
                  onClick={() => onSelect("cancel")}
                >
                  취소
                </button>
              </>
            ) : (
              <>
                <button
                  className="bg-blue-700 text-white px-4 py-2 rounded"
                  onClick={() => onSelect("circuit")}
                >
                  서킷
                </button>
                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded"
                  onClick={() => onSelect("cancel")}
                >
                  취소
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2) 교정 진행 안내 팝업
  if (type === "process") {
    return (
      <div className={popupBg}>
        <div className={popupBox}>
          <h3 className="text-xl font-bold mb-4">교정 진행 시, 주의사항</h3>
          <ol className="text-left list-decimal list-inside mb-6">
            <li>박테리아 필터, 가습 챔버, 서킷과 캐뉼라를 올바르게 장착하십시오.</li>
            <li>서킷, 캐뉼라, 에어 홀이 막히지 않도록 하십시오.</li>
            <li>교정 진행 중에 장치 및 서킷 또는 캐뉼라를 움직이지 마십시오.</li>
          </ol>
          <div className="flex justify-center gap-4">
            <button
              className="bg-green-600 text-white px-6 py-2 rounded"
              onClick={onConfirm}
            >
              확인
            </button>
            <button
              className="bg-gray-600 text-white px-6 py-2 rounded"
              onClick={onConfirm}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3) 치료 시작 확인 팝업
  if (type === "startConfirm") {
    return (
      <div className={popupBg}>
        <div className={popupBox}>
          <h3 className="text-xl font-bold mb-6">치료 시작</h3>
          <p className="mb-6">치료를 시작하시겠습니까?</p>
          <div className="flex justify-center gap-4">
            <button
              className="bg-green-600 text-white px-6 py-2 rounded"
              onClick={onConfirm}
            >
              확인
            </button>
            <button
              className="bg-gray-600 text-white px-6 py-2 rounded"
              onClick={onConfirm}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 4) 치료 종료 확인 팝업
  if (type === "stopConfirm") {
    return (
      <div className={popupBg}>
        <div className={popupBox}>
          <h3 className="text-xl font-bold mb-6">치료 종료</h3>
          <p className="mb-6">치료를 종료하시겠습니까?</p>
          <div className="flex justify-center gap-4">
            <button
              className="bg-red-600 text-white px-6 py-2 rounded"
              onClick={onConfirm}
            >
              확인
            </button>
            <button
              className="bg-gray-600 text-white px-6 py-2 rounded"
              onClick={onConfirm}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
