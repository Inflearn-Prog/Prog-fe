"use client";
import React, { useState } from 'react';
import Image from "next/image";

interface Step2Props {
  nickname: string;
  setNickname: (nickname: string) => void;
  icon: string;
  setIcon: (icon: string) => void;
  setStep: (step: number) => void;
}

export const Step2 = React.memo(({ 
  nickname, 
  setNickname, 
  icon, 
  setIcon, 
  setStep 
}: Step2Props) => {
  
  const [selectedButton, setSelectedButton] = useState(icon !== "" ? (icon === "kakao" ? "button1" : "button2") : "");
  
  const [duplicateMessage, setDuplicateMessage] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);

  const isNicknameValid = nickname.length >= 2;
  const isStep2Complete = isAvailable && icon !== ""; 

  const checkDuplicate = () => {
    if (!isNicknameValid) {
      setDuplicateMessage("닉네임을 2자 이상 입력해주세요.");
      setIsAvailable(false);
      return;
    }

    if (nickname === "admin") {
      setDuplicateMessage("이미 사용 중인 닉네임입니다.");
      setIsAvailable(false);
    } else {
      setDuplicateMessage("사용 가능한 닉네임입니다.");
      setIsAvailable(true);
    }
  };

  // 닉네임이 수정되면 중복 확인 상태 초기화
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setDuplicateMessage(""); 
    setIsAvailable(false);  
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 text-center">Prog에서 어떻게 불리고 싶으신가요?</h2>
      <p className="mb-6 text-center text-sm text-gray-600">이름과 프로필 사진을 선택해주세요.</p>


      <div className="flex gap-8 mb-8 items-center justify-center">

        <div className="flex flex-col gap-4 text-center">
          <button type="button" onClick={() => { setIcon('/심볼_레드.svg'); setSelectedButton("button1"); }}>
            <Image 
              className={`rounded-full shadow-lg transition-all ${selectedButton === "button1" ? "border-8 border-[#216DE5]" : "border-8 border-transparent"}`} 
              src="/심볼_레드.svg" width={180} height={180} alt="프로필1" 
            />
          </button>
          <p className="text-sm font-medium">카카오톡 프로필</p>
        </div>

        <div className="flex flex-col gap-4 text-center">
          <button type="button" onClick={() => { setIcon('/심볼_레드.svg'); setSelectedButton("button2"); }}>
            <Image 
              className={`rounded-full shadow-lg transition-all ${selectedButton === "button2" ? "border-8 border-[#216DE5]" : "border-8 border-transparent"}`} 
              src="/심볼_레드.svg" width={180} height={180} alt="프로필2" 
            />
          </button>
          <p className="text-sm font-medium">Prog 프로필</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="닉네임을 입력해주세요"
            value={nickname}
            onChange={handleNicknameChange} 
            className={`w-full p-3 border rounded-md focus:outline-none ${
              isAvailable ? "border-[#216DE5]" : "border-gray-300 focus:border-[#216DE5]"
            }`}
          />
          <button 
            type="button"
            className={`text-white text-sm min-w-[100px] rounded-md py-3 transition-colors ${
              isNicknameValid ? `bg-[#216DE5] hover:bg-blue-700` : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isNicknameValid}
            onClick={checkDuplicate}
          >
            중복확인
          </button>
        </div>
        
        {duplicateMessage && (
          <p className={`text-xs font-medium ml-1 ${isAvailable ? "text-blue-600" : "text-red-500"}`}>
            {duplicateMessage}
          </p>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <button
          className={`w-full max-w-[414px] text-white py-3 rounded-md font-bold transition-colors label-large ${
            isStep2Complete ? "bg-frog-600 hover:bg-frog-700" : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={() => isStep2Complete && setStep(3)}
          disabled={!isStep2Complete}
        >
          다음
        </button>
    </div>
    </div>
  );
});

Step2.displayName = 'Step2';