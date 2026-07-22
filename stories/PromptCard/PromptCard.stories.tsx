import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import PromptCard from "@/components/prompt/prompt-card";
import ReportModal from "@/components/prompt/report-modal";

import { StoryBox } from "../StoryBox";

const meta: Meta<typeof PromptCard> = {
  title: "Components/Prompt/PromptCard",
  component: PromptCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StoryBox>
        <Story />
      </StoryBox>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PromptCard>;

export const Default: Story = {
  args: {
    promptId: 1,
    createdAt: new Date().toISOString(),
    category: {
      categoryId: 1,
      name: "개발",
      description: "개발 설명",
    },
    title: "자소서를 위한 GPT 프롬프트 제목",
    contentSummary: "자소서를 위한 GPT 프롬프트 설명입니다.",
    userIcon: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    userName: "닉네임",
    userDesc: "유저 설명",
  },
  render: (args) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [reasonDetail, setReasonDetail] = useState("");

    const handleSelect = (val: string) => {
      setReason(val);
      if (val !== "OTHER") setReasonDetail("");
    };

    const onCancel = () => {
      setReason("");
      setReasonDetail("");
      setIsModalOpen(false);
    };

    const onReport = () => {
      setReason("");
      setReasonDetail("");
      setIsModalOpen(false);
    };

    return (
      <>
        <PromptCard {...args} onReport={() => setIsModalOpen(true)} />

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-lg w-[400px]">
              <ReportModal
                title="어떤 문제가 있나요?"
                reason={reason}
                reasonDetail={reasonDetail}
                onSelect={handleSelect}
                onOtherChange={setReasonDetail}
                onCancel={onCancel}
                onReport={onReport}
              />
            </div>
          </div>
        )}
      </>
    );
  },
};
