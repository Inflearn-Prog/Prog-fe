"use client";

import Link from "next/link";
import { useState } from "react";

import {
  EDUCATION_OPTIONS,
  JobType,
  STATE_VALUES,
} from "@/app/(beforeLogin)/(auth)/constant";
import { StatusSelect } from "@/app/(beforeLogin)/(auth)/signup/component/StatusSelect";
import { TargetJobsSelect } from "@/app/(beforeLogin)/(auth)/signup/component/TargetJobsSelect";
import { useSignupStore } from "@/app/store/signUpStore";
import UserExperience from "@/components/mypage/user-experience";
import UserKeyword from "@/components/mypage/user-keyword";
import { BaseButton } from "@/components/shared/button";
import { BaseCheckBox } from "@/components/shared/checkbox";
import { BaseInput } from "@/components/shared/inputs";
import { SelectBox } from "@/components/shared/select-box";

export default function MypageRightSection() {
  const [otherInput, setOtherInput] = useState("");
  const [experiences, setExperiences] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);

  // 개인정보 마케팅 동의 상태 (예시)
  const [marketingAgree, setMarketingAgree] = useState(false);

  const {
    targetJobs,
    setTargetJobs,
    currentState,
    career,
    educationLevel,
    updateField,
  } = useSignupStore();

  // 직무 클릭 핸들러
  const handleJobClick = (option: string) => {
    const castedOption = option as JobType;
    if (targetJobs.includes(castedOption)) {
      setTargetJobs(targetJobs.filter((j) => j !== castedOption));
    } else {
      setTargetJobs([...targetJobs, castedOption]);
    }
  };

  // 섹션별 저장 핸들러
  const handleSaveEmployment = async () => {
    const payload = {
      currentState:
        currentState === STATE_VALUES.OTHER ? otherInput : currentState,
      targetJobs,
      educationLevel,
      career,
    };
    console.log("취업/경력 저장:", payload);
    alert("취업/경력 정보가 저장되었습니다.");
  };

  const handleSaveProfile = async () => {
    const payload = { experiences, keywords };
    console.log("프로필 저장:", payload);
    alert("프로필 정보가 저장되었습니다.");
  };

  const handleSavePrivacy = async () => {
    console.log("개인정보 설정 저장:", { marketingAgree });
    alert("개인정보 설정이 변경되었습니다.");
  };

  const handleCancel = () => {
    if (confirm("변경사항이 저장되지 않을 수 있습니다. 취소하시겠습니까?")) {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 1. 취업/경력 섹션 */}
      <div className="flex flex-col gap-7 bg-gray-0 p-5 border border-gray-100 shadow-md rounded-[10px]">
        <p className="heading-small gray-0">{"취업/경력"}</p>
        <StatusSelect
          label={"현재 상태"}
          value={currentState}
          otherValue={otherInput}
          onSelect={(val) => {
            updateField("currentState", val);
            if (val !== STATE_VALUES.OTHER) setOtherInput("");
          }}
          onOtherChange={setOtherInput}
        />
        <TargetJobsSelect
          label={"목표 직무"}
          selectedJobs={targetJobs}
          onToggle={handleJobClick}
        />
        <div className="flex gap-4 w-full">
          <div className="flex flex-1 flex-col gap-2">
            <label className="body-medium text-gray-700">최종학력</label>
            <SelectBox
              placeholder="학력을 선택해주세요"
              value={educationLevel}
              onValueChange={(val) => updateField("educationLevel", val)}
              selectOptions={EDUCATION_OPTIONS}
            />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <label className="body-medium text-gray-700">총 경력</label>
            <BaseInput
              placeholder="예) 0년"
              inputMode="numeric"
              inputSize="lg"
              value={career}
              viewLength={true}
              maxLength={100}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                updateField("career", val === "" ? 0 : Number(val));
              }}
            />
          </div>
        </div>
        <div className="flex gap-5 justify-end mt-2">
          <BaseButton
            onClick={handleCancel}
            variant="secondary"
            className="bg-gray-0 px-4 py-2.5 min-w-[197px]"
          >
            취소
          </BaseButton>
          <BaseButton
            onClick={handleSaveEmployment}
            className="px-4 py-2.5 min-w-[197px]"
          >
            변경사항 저장
          </BaseButton>
        </div>
      </div>

      {/* 2. 자기소개 프로필 섹션 */}
      <div className="flex flex-col gap-8 bg-gray-0 p-5 border border-gray-100 rounded-[10px] shadow-md">
        <div className="flex justify-between items-end">
          <p className="heading-small gray-0">{"자기소개 프로필"}</p>
          <p className="text-frog-600 body-small">
            자소서 미리보기에 활용될 정보입니다
          </p>
        </div>
        <UserExperience
          value={experiences}
          label="대표 경험"
          placeholder="대표경험 입력하고 Enter"
          onChange={setExperiences}
        />
        <UserKeyword
          value={keywords}
          label="나를 설명하는 키워드"
          placeholder="키워드 입력 후 Enter"
          onChange={setKeywords}
        />
        <div className="flex gap-5 justify-end mt-2">
          <BaseButton
            onClick={handleCancel}
            variant="secondary"
            className="bg-gray-0 px-4 py-2.5 min-w-[197px]"
          >
            취소
          </BaseButton>
          <BaseButton
            onClick={handleSaveProfile}
            className="px-4 py-2.5 min-w-[197px]"
          >
            변경사항 저장
          </BaseButton>
        </div>
      </div>

      {/* 3. 개인정보 관리 섹션 */}
      <div className="flex flex-col gap-8 bg-gray-0 p-5 border border-gray-100 rounded-[10px] shadow-md">
        <div className="flex justify-between items-end">
          <p className="heading-small gray-0">{"개인정보 관리"}</p>
          <p className="text-gray-700 body-small">
            현재 적용 중인 개인정보 수집 및 이용 동의 현황입니다.
          </p>
        </div>

        <div className="flex items-center justify-between py-4 px-2 rounded-[8px]">
          <BaseCheckBox
            id="marketing-agree"
            label="마케팅 정보 수신 동의 (선택)"
            checked={marketingAgree}
            onCheckedChange={(checked) => setMarketingAgree(!!checked)}
          />
          <Link
            href="__링크__"
            className="text-frog-600 label-medium hover:underline px-2"
            target="_blank"
          >
            보기
          </Link>
        </div>

        <div className="flex gap-5 justify-end mt-2">
          <BaseButton
            onClick={handleCancel}
            variant="secondary"
            className="bg-gray-0 px-4 py-2.5 min-w-[197px]"
          >
            취소
          </BaseButton>
          <BaseButton
            onClick={handleSavePrivacy}
            className="px-4 py-2.5 min-w-[197px]"
          >
            변경사항 저장
          </BaseButton>
        </div>
      </div>
    </div>
  );
}
