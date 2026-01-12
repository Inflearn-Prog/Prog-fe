import type { Meta, StoryObj } from "@storybook/nextjs";

import { ProgTerms } from "@/components/terms/terms-check";
import { Term } from "@/components/terms/types";
import { useTermsChecks } from "@/hooks/use-terms-checks";

const meta: Meta<typeof ProgTerms> = {
  title: "components/terms/terms-check",
  component: ProgTerms,
};

export default meta;

//default Terms
type Story = StoryObj<typeof ProgTerms>;

// API 응답 모사 데이터
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

export const DefaultCheckBox: Story = {
  render: () => {
    const { checks, handleAllCheck, handleSingleCheck } =
      useTermsChecks(MOCK_TERMS);

    return (
      <div className="max-w-lg p-4 bg-white">
        <ProgTerms
          terms={MOCK_TERMS}
          checks={checks}
          onAllCheck={handleAllCheck}
          onSingleCheck={handleSingleCheck}
        />
      </div>
    );
  },
};
