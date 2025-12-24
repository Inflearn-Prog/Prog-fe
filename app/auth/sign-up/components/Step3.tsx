import React from 'react';
import { STATE_OPTIONS, JOB_OPTIONS } from '../../constants/options';

interface Step3Props {
  currentState: string;
  setCurrentState: (state: string) => void;
  otherInput: string;
  setOtherInput: (other: string) => void;
  targetJobs: string[];
  onTargetJob: (job: string) => void;
  setStep: (step: number) => void;
}

export const Step3 = React.memo(({ 
  currentState, 
  setCurrentState, 
  otherInput, 
  setOtherInput, 
  targetJobs, 
  onTargetJob,
  setStep 
}: Step3Props) => {
  
  const isStateValid = currentState !== "" && (currentState !== "기타" || (otherInput || "").trim().length > 0);
  const isStep3Complete = isStateValid && targetJobs.length > 0;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 text-center">어떤 커리어를 꿈꾸시나요?</h2>
      <p className="mb-6 text-center text-sm text-gray-600">선택한 내용은 이후에도 변경이 가능해요!</p>
      
      <div className="flex flex-col gap-6">
        <section>
          <p className="mb-2 font-medium">현재 상태를 선택해주세요.</p>
          <div className="flex gap-2 flex-wrap">
            {STATE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setCurrentState(option);
                  if (option !== '기타') setOtherInput(''); 
                }}
                className={`text-center min-w-[120px] py-2 rounded-md font-medium transition-colors ${
                  currentState === option
                    ? "bg-[#216DE5] text-white shadow-md"
                    : "bg-[#F4F5F6] text-gray-700 hover:bg-gray-300"
                }`}
              >
                {option}
              </button>
            ))}
            {currentState === "기타" && (
              <input 
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#216DE5]" 
                placeholder="직접입력" 
                value={otherInput}
                onChange={(e) => setOtherInput(e.target.value)}
              />
            )}
          </div>
        </section>

        <section>
          <p className="mb-2 font-medium">목표 직무를 선택해주세요 (복수선택가능).</p>
          <div className="flex gap-2 flex-wrap">
            {JOB_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onTargetJob(option)} 
                className={`text-center min-w-[100px] py-2 rounded-md font-medium transition-colors ${
                  targetJobs.includes(option)
                    ? "bg-[#216DE5] text-white shadow-md"
                    : "bg-[#F4F5F6] text-gray-700 hover:bg-gray-300"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="flex justify-center mt-6">
        <button
          className={`w-full max-w-[414px] text-white py-3 rounded-md font-bold transition-colors label-large ${
            isStep3Complete ? "bg-frog-600 hover:bg-frog-700" : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={() => isStep3Complete && setStep(4)}
          disabled={!isStep3Complete}
        >
          다음
        </button>
      </div>
    </div>
  );
});

Step3.displayName = 'Step3';