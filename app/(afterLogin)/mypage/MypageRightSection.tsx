"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  EDUCATION_OPTIONS,
  EducationValue,
  JobType,
  STATE_VALUES,
  transformCareerInfoToState,
  transformStateToPayload,
} from "@/app/(beforeLogin)/(auth)/constant";
import { StatusSelect } from "@/app/(beforeLogin)/(auth)/signup/component/StatusSelect";
import { TargetJobsSelect } from "@/app/(beforeLogin)/(auth)/signup/component/TargetJobsSelect";
import { useMypageStore } from "@/app/store/mypageStore";
import UserExperience from "@/components/mypage/user-experience";
import UserKeyword from "@/components/mypage/user-keyword";
import { BaseButton } from "@/components/shared/button";
import { BaseCheckBox } from "@/components/shared/checkbox";
import { BaseInput } from "@/components/shared/inputs";
import { SelectBox } from "@/components/shared/select-box";
import { toasts } from "@/components/shared/toast";
import { useUpdateProfile, useUserProfile } from "@/hooks/use-mypage";
import { usePostTerms } from "@/hooks/use-terms-checks";
import { UpdateProfileRequest } from "@/queries/api/mypage";

export default function MypageRightSection() {
  const { data: profile, isLoading } = useUserProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { mutate: postTermsMutation, isPending: isTermsPending } =
    usePostTerms();

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
    reset,
  } = useMypageStore();

  useEffect(() => {
    return () => reset();
  }, [reset]);

  //TODO: 약관동의 동의 여부를 조회가능한 API 있는지 확인
  const initialized = useRef(false);
  useEffect(() => {
    if (profile) {
      if (initialized.current) return;
      initialized.current = true;
      const { careerInfo, selfIntro } = profile;

      const normalized = transformCareerInfoToState(careerInfo);

      setTargetJobs(normalized.targetJobs);
      updateField("currentState", normalized.currentState);
      updateField("educationLevel", normalized.educationLevel);
      updateField("career", normalized.career);

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

  const handleMarketingChange = () => {
    const termIds = marketingAgree ? [1, 2, 3] : [1, 2];

    postTermsMutation(termIds, {
      onSuccess: () => {
        toasts.success("마케팅 수신 동의 설정이 저장되었습니다.");
      },
      onError: (error) => {
        console.error("약관 업데이트 실패:", error);
        alert("저장에 실패했습니다.");
        //toasts.error("저장에 실패했습니다.");
      },
    });
  };

  const handleGlobalSave = () => {
    if (!profile) return;

    if (currentState === STATE_VALUES.OTHER && !otherInput.trim()) {
      alert("기타 상태를 직접 입력해주세요.");
      //toasts.error("기타 상태를 직접 입력해주세요.");
      return;
    }
    const careerPayload = transformStateToPayload({
      currentState,
      targetJobs,
      otherInput,
      career,
      educationLevel,
    });

    const payload: UpdateProfileRequest = {
      basicInfo: {
        nickname: profile.basicInfo.nickname,
        introduction: profile.basicInfo.introduction || "",
      },
      careerInfo: {
        ...careerPayload,
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
              onValueChange={(val) =>
                updateField("educationLevel", val as EducationValue)
              }
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
            disabled={isPending}
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
            disabled={isPending}
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
            href="#" // TODO: 실제 마케팅 동의 약관 URL로 교체
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
            onClick={handleMarketingChange}
            disabled={isTermsPending}
            className="px-4 py-2.5 min-w-[197px]"
          >
            변경사항 저장
          </BaseButton>
        </div>
      </section>
    </div>
  );
}
