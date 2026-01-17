import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react"; // UI 테스트를 위한 임시 상태

import { ProgTerms } from "@/components/terms/terms-check";
import { Term } from "@/components/terms/types";

import { StoryBox } from "../StoryBox";

const meta: Meta<typeof ProgTerms> = {
  title: "components/Terms/terms-check",
  component: ProgTerms,
};

export default meta;

type Story = StoryObj<typeof ProgTerms>;

const MOCK_TERMS: Term[] = [
  {
    termId: 1,
    title: "이용약관 동의",
    isRequired: true,
    hasDetails: true,
    link: "https://notion.so/1",
  },
  {
    termId: 2,
    title: "개인정보 수집 및 이용 동의",
    isRequired: true,
    hasDetails: true,
    link: "https://notion.so/2",
  },
  {
    termId: 3,
    title: "마케팅 정보 수신 동의",
    isRequired: false,
    hasDetails: true,
    link: "https://notion.so/3",
  },
];

export const DefaultTerms: Story = {
  render: () => {
    // 로직은 컴포넌트 밖(부모)에서 관리합니다.
    // 나중에 이 부분은 react-hook-form의 상태로 대체될 예정입니다.
    const [checks, setChecks] = useState<Map<number, boolean>>(new Map());

    const handleSingleCheck = (id: number, checked: boolean) => {
      setChecks((prev) => {
        const next = new Map(prev);
        next.set(id, checked);
        return next;
      });
    };

    const handleAllCheck = (checked: boolean) => {
      const next = new Map();
      MOCK_TERMS.forEach((t) => next.set(t.termId, checked));
      setChecks(next);
    };

    const isAllChecked =
      MOCK_TERMS.length > 0 && MOCK_TERMS.every((t) => checks.get(t.termId));

    return (
      <StoryBox>
        <div className="max-w-lg p-4 bg-white">
          <ProgTerms
            terms={MOCK_TERMS}
            checks={checks}
            isAllChecked={isAllChecked}
            onAllCheck={handleAllCheck}
            onSingleCheck={handleSingleCheck}
          />
        </div>
      </StoryBox>
    );
  },
};
