"use client";

import TopBar from "../../component/TopBar";
import { useState } from "react";
import { Step1 } from "./components/Step1";
import { Step2 } from "./components/Step2";
import { Step3 } from "./components/Step3";
import { Step4 } from "./components/Step4";
import { Step5 } from "./components/Step5";
import { Stepper } from "./components/Stepper";
import { ChecksState, CheckKeys } from "./types";

export default function SignupContainer() {
  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState("");
  const [icon, setIcon] = useState("");
  const [currentState, setCurrentState] = useState("");
  const [otherInput, setOtherInput] = useState("");
  const [targetJobs, setTargetJobs] = useState<string[]>([]);
  const [education, setEducation] = useState("");
  const [field, setField] = useState("");
  const [career, setCareer] = useState("");
  const [checks, setChecks] = useState<ChecksState>({
    all: false, terms: false, privacy: false, marketing: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);  

  const handleAllCheck = () => { //약관전체동의
    const newValue = !checks.all;
    setChecks({ all: newValue, terms: newValue, privacy: newValue, marketing: newValue });
  };

  const handleSingleCheck = (key: CheckKeys) => { //단일 동의
    setChecks((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      updated.all = updated.terms && updated.privacy && updated.marketing;
      return updated;
    });
  };

  const handleTargetJob = (job: string) => { //목표직무 선택
    setTargetJobs(prev => prev.includes(job) ? prev.filter(j => j !== job) : [...prev, job]);
  };

  const handleSignup = async () => { //회원가입 데이터 서버 전송
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
          const signupData = {
            nickname,
            icon,
            currentState,
            otherInput,
            targetJobs,
            education,
            field,
            career,
            agreements: checks,
          };
      
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(signupData),
        });

        if (response.ok) {
          setStep(5); // 성공 시 완료 페이지로
        } else {
          alert("회원가입 실패");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmitting(false); // 성공하든 실패하든 로딩 종료
    }
};

  return (
  <div className="grid grid-cols-12 min-h-screen w-full bg-gray-50">
  <header className="col-span-12 h-fit border-b border-gray-100 bg-white z-30">
    <TopBar />
  </header>
  <main className="col-span-12 flex flex-col items-center justify-center px-4 relative min-h-[calc(100vh-64px)]">
    
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10" />

    <div className={`z-20 w-full bg-white rounded-xl p-10 shadow-2xl border border-gray-100 transition-all duration-300 ${
    step === 1 ? "max-w-[630px]" : "max-w-[846px]"
  }`}>
      
      {/* Stepper 영역 (진행바) */}
      {(step > 1 && step < 5) && (
        <div className="mb-8">
          <Stepper currentStep={step} />
        </div>
      )}
      
      {/* 각 스텝별 컨텐츠 */}
      <div className="flex flex-col gap-6">
        {step === 1 && (
          <Step1 
            checks={checks} 
            onAllCheck={handleAllCheck} 
            onSingleCheck={handleSingleCheck} 
            setStep={setStep} 
          />
        )}
        {step === 2 && (
          <Step2 
            nickname={nickname} 
            setNickname={setNickname} 
            icon={icon} 
            setIcon={setIcon} 
            setStep={setStep} 
          />
        )}
        {step === 3 && (
          <Step3 
            currentState={currentState} 
            setCurrentState={setCurrentState} 
            otherInput={otherInput} 
            setOtherInput={setOtherInput} 
            targetJobs={targetJobs} 
            onTargetJob={handleTargetJob} 
            setStep={setStep} 
          />
        )}
        {step === 4 && (
          <Step4 
            education={education} 
            setEducation={setEducation} 
            field={field} 
            setField={setField} 
            career={career} 
            setCareer={setCareer} 
            onSignup={handleSignup}
            isSubmitting={isSubmitting}
          />
        )}
        {step === 5 && <Step5 />}
      </div>
    </div>
  </main>
</div>
  );
}