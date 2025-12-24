import React from 'react';
import { ChecksState, CheckKeys } from '../types';

interface Step1Props {
  checks: ChecksState;
  onAllCheck: () => void;
  onSingleCheck: (key: CheckKeys) => void;
  setStep: (step: number) => void;
}

const CheckboxItem = ({ label, required, checked, onChange }: any) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}

        className="w-4 h-4 accent-frog-600 border-gray-300 rounded cursor-pointer"
      />

      <span className="body-small text-gray-700">
        {required ? <span className="font-medium mr-1">(필수)</span>
                  : <span className="font-medium mr-1">(선택)</span>}
        {label}
      </span>
    </div>

    <button type="button" className="text-frog-600 body-small hover:underline">보기</button>
  </div>
);

export const Step1 = React.memo(({ checks, onAllCheck, onSingleCheck, setStep }: Step1Props) => {
  const isStep1Complete = checks.terms && checks.privacy;

  return (
    <div>

      <h2 className="heading-large mb-4 text-center text-gray-900">환영합니다!</h2>

      <p className="mb-6 text-center body-small text-gray-600">서비스 이용약관에 동의해주세요</p>
  
      <div className="bg-gray-200 rounded-md p-3 mb-4 flex items-center gap-2">
        <input
          type="checkbox"
          checked={checks.all}
          onChange={onAllCheck}
          className="w-4 h-4 accent-frog-600 border-gray-300 rounded cursor-pointer"
        />

        <span className="body-small font-bold text-gray-900">전체 동의하기</span>
      </div>

      <div className="bg-gray-200 rounded-md p-3 space-y-1">
        <CheckboxItem 
          label="이용약관 동의" 
          required 
          checked={checks.terms} 
          onChange={() => onSingleCheck("terms")} 
        />
        <CheckboxItem 
          label="개인정보 수집 및 이용 동의" 
          required 
          checked={checks.privacy} 
          onChange={() => onSingleCheck("privacy")} 
        />
        <CheckboxItem 
          label="마케팅 정보 수신 동의" 
          required={false} 
          checked={checks.marketing} 
          onChange={() => onSingleCheck("marketing")} 
        />
      </div>

      <div className="flex justify-center mt-6">
        <button
          className={`w-full max-w-[414px] text-white py-3 rounded-md font-bold transition-colors label-large ${
            isStep1Complete ? "bg-frog-600 hover:bg-frog-700" : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={() => isStep1Complete && setStep(2)}
          disabled={!isStep1Complete}
        >
          다음
        </button>
      </div>
    </div>
  );
});

Step1.displayName = 'Step1';