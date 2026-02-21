"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  EDUCATION_OPTIONS,
  JOB_MAP,
  JobType,
  REVERSE_JOB_MAP,
  REVERSE_STATE_MAP,
  STATE_MAP,
  STATE_VALUES,
  StateType,
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
import { useUpdateProfile, useUserProfile } from "@/hooks/use-mypage";
import { UpdateProfileRequest } from "@/queries/api/mypage";

export default function MypageRightSection() {
  const { data: profile, isLoading } = useUserProfile();
  const { mutate: updateProfile } = useUpdateProfile();

  const [otherInput, setOtherInput] = useState("");
  const [experiences, setExperiences] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [marketingAgree, setMarketingAgree] = useState(false);

  const {
    targetJobs,
    setTargetJobs,
    currentState,
    career,
    educationLevel,
    updateField,
  } = useSignupStore();

  // 1. 서버 데이터 로드 시 초기화 및 타입 싱크
  useEffect(() => {
    if (profile) {
      const { careerInfo, selfIntro } = profile;

      // 직무 변환 (영문 코드 배열 -> 한글 라벨 배열)
      const jobsInKorean = careerInfo.targetJob.map(
        (code) => JOB_MAP.get(code) || code
      );
      setTargetJobs(jobsInKorean as JobType[]);

      // 상태 변환 (배열의 첫 번째 요소 추출 -> 한글 라벨)
      const serverStateKey = careerInfo.currentStatus[0];
      const stateInKorean = STATE_MAP.get(serverStateKey) || "";

      // Zustand 스토어 타입에 맞게 단언하여 업데이트
      updateField("currentState", stateInKorean as "" | StateType);

      updateField("educationLevel", careerInfo.education);
      const serverCareer = careerInfo.careerYear;
      const careerNumber = serverCareer === "신입" ? 0 : Number(serverCareer);
      updateField("career", careerNumber);
      setExperiences(selfIntro.experiences || []);
      setKeywords(selfIntro.keywords || []);
    }
  }, [profile, setTargetJobs, updateField]);

  if (isLoading) {
    return (
      <div className="p-10 text-center text-gray-400">
        정보를 불러오는 중...
      </div>
    );
  }

  const handleJobClick = (option: string) => {
    const castedOption = option as JobType;
    if (targetJobs.includes(castedOption)) {
      setTargetJobs(targetJobs.filter((j) => j !== castedOption));
    } else {
      setTargetJobs([...targetJobs, castedOption]);
    }
  };

  // 2. 저장 핸들러
  const handleGlobalSave = () => {
    if (!profile) return;

    const targetJobCodes = targetJobs.map(
      (label) => REVERSE_JOB_MAP.get(label) || label
    );

    const currentStateCode =
      REVERSE_STATE_MAP.get(currentState) || currentState;

    const payload: UpdateProfileRequest = {
      basicInfo: {
        nickname: profile.basicInfo.nickname,
        introduction: profile.basicInfo.introduction || "",
      },
      careerInfo: {
        currentStatus: currentStateCode,
        targetJob: targetJobCodes,
        careerYear: career,
        education: educationLevel,
        major: profile.careerInfo.major || "",
      },
      selfIntro: {
        experiences,
        keywords,
      },
    };

    updateProfile(payload);
  };

  const handleCancel = () => {
    if (confirm("변경사항이 저장되지 않을 수 있습니다. 취소하시겠습니까?")) {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 1. 취업/경력 섹션 */}
      <section className="flex flex-col gap-7 bg-gray-0 p-5 border border-gray-100 shadow-md rounded-[10px]">
        <p className="heading-small text-gray-900">취업/경력</p>
        <StatusSelect
          label="현재 상태"
          value={currentState}
          otherValue={otherInput}
          onSelect={(val) => {
            updateField("currentState", val);
            if (val !== STATE_VALUES.OTHER) setOtherInput("");
          }}
          onOtherChange={setOtherInput}
        />
        <TargetJobsSelect
          label="목표 직무"
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
              placeholder="예) 0"
              inputMode="numeric"
              inputSize="lg"
              value={career}
              maxLength={2}
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
            onClick={handleGlobalSave}
            className="px-4 py-2.5 min-w-[197px]"
          >
            변경사항 저장
          </BaseButton>
        </div>
      </section>

      {/* 2. 자기소개 프로필 섹션 */}
      <section className="flex flex-col gap-8 bg-gray-0 p-5 border border-gray-100 rounded-[10px] shadow-md">
        <div className="flex justify-between items-end">
          <p className="heading-small text-gray-900">자기소개 프로필</p>
          <p className="text-frog-600 body-small">
            자소서 미리보기에 활용될 정보입니다
          </p>
        </div>
        <UserExperience
          value={experiences}
          label="대표 경험"
          placeholder="대표경험을 입력하고 Enter"
          onChange={setExperiences}
        />
        <UserKeyword
          value={keywords}
          label="나를 설명하는 키워드"
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
            onClick={handleGlobalSave}
            className="px-4 py-2.5 min-w-[197px]"
          >
            변경사항 저장
          </BaseButton>
        </div>
      </section>

      {/* 3. 개인정보 관리 섹션 */}
      <section className="flex flex-col gap-8 bg-gray-0 p-5 border border-gray-100 rounded-[10px] shadow-md">
        <div className="flex justify-between items-end">
          <p className="heading-small text-gray-900">개인정보 관리</p>
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
            href="#"
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
            onClick={handleGlobalSave}
            className="px-4 py-2.5 min-w-[197px]"
          >
            변경사항 저장
          </BaseButton>
        </div>
      </section>
    </div>
  );
}
