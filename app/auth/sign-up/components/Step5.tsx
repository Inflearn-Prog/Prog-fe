"use client";
import React from 'react';
import Link from "next/link";
import Image from "next/image";

export const Step5 = React.memo(() => (
  <div className="flex flex-col text-center py-6 items-center justify-center">
    <Image 
      className="mb-8" 
      src='/심볼.svg' 
      alt='prog 심볼' 
      width={110} 
      height={120} 
      priority
    />
    
    <h2 className="display-small mb-6 text-center text-gray-900">
      <span className="text-frog-600">Prog</span>와 함께하게<br /> 되신 것을 환영합니다!
    </h2>
    
    <p className="mb-12 body-large text-gray-600 leading-relaxed px-4">
      회원가입이 성공적으로 완료되었습니다.<br />
      나에게 딱 맞는 프롬프트로 커리어 여정을<br />
      지금 바로 시작해보세요!
    </p>
    
    <Link href="/" className="inline-block w-full max-w-[414px]">
      <button
        className="w-full bg-frog-600 text-white py-4 rounded-xl font-bold hover:bg-frog-700 shadow-lg shadow-frog-100 transition-all label-large"
      >
        Prog 시작하기
      </button>
    </Link>
  </div>
));

Step5.displayName = 'Step5';