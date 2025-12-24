"use client";
import React from 'react';

interface Step4Props {
  education: string;
  setEducation: (edu: string) => void;
  field: string;
  setField: (field: string) => void;
  career: string;
  setCareer: (year: string) => void;
  onSignup: () => Promise<void>;
  isSubmitting: boolean;
}

export const Step4 = React.memo(({ 
  education, setEducation, field, setField, career, setCareer, onSignup, isSubmitting 
}: Step4Props) => {
  
  const isCareerValid = career.trim().length > 0 && /^\d+/.test(career.replace(/[^0-9]/g, ''));
  const isComplete = education !== "" && field !== "" && isCareerValid && !isSubmitting;

  return (
    <div>
      <h2 className="heading-large mb-4 text-center text-gray-900">자세한 정보를 알려주세요</h2>
      <p className="body-small mb-8 text-center text-gray-600">프로그와 함께 멋진 미래를 그려봐요!</p>
      
      <div className="flex flex-col gap-4">
        {/* 최종학력 선택 */}
        <div className="flex flex-col gap-2">
          <label className="label-medium font-medium text-gray-900">최종학력</label>
          <select 
            className="border  border-gray-300 rounded-md p-2 body-medium focus:outline-none focus:border-frog-600" 
            value={education} 
            onChange={(e) => setEducation(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="" disabled>선택해주세요.</option>
            <option value="high_school">고등학교 졸업</option>
            <option value="college">전문대 졸업</option>
            <option value="univ">대학교 졸업</option>
            <option value="master">석사 졸업</option>
            <option value="phd">박사 졸업</option>
          </select>
        </div>

        {/* 계열 선택 */}
        <div className="flex flex-col gap-2">
          <label className="label-medium font-medium text-gray-900">계열</label>
          <select 
            className="border border-gray-300 rounded-md p-2 body-medium focus:outline-none focus:border-frog-600" 
            value={field} 
            onChange={(e) => setField(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="" disabled>선택해주세요.</option>
            <option value="liberal_arts">인문계열</option>
            <option value="engineering">이공계열</option>
            <option value="arts">예체능계열</option>
          </select>
        </div>

        {/* 경력 입력 */}
        <div className="flex flex-col gap-2">
          <label className="label-medium font-medium text-gray-900">총 경력</label>
          <input 
            className="border border-gray-300 rounded-md p-2 body-medium focus:outline-none focus:border-frog-600" 
            placeholder="예) 3(숫자만 입력)" 
            value={career}
            onChange={(e) => setCareer(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          disabled={!isComplete}
          className={`w-full max-w-[414px] py-3 rounded-md font-bold text-white transition-all flex justify-center items-center gap-2 label-large ${
            isComplete 
              ? "bg-frog-600 hover:bg-frog-700 shadow-md" 
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={onSignup}
        >
          가입 완료
        </button>
      </div>
    </div>
  );
});

Step4.displayName = 'Step4';