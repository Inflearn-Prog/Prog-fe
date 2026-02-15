import type { Meta, StoryObj } from "@storybook/nextjs";

import PromptCardSkeleton from "@/components/prompt/prompt-card-skeleton";

import { StoryBox } from "../StoryBox";

const meta: Meta<typeof PromptCardSkeleton> = {
  title: "Components/Prompt/PromptCard",
  component: PromptCardSkeleton,
  decorators: [
    (Story) => (
      <StoryBox>
        <Story />
      </StoryBox>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PromptCardSkeleton>;

export const Skeleton: Story = {};

/**
 * 랭킹 페이지처럼 리스트로 보여질 때의 모습
 */
export const SkeletonList: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <PromptCardSkeleton />
      <PromptCardSkeleton />
      <PromptCardSkeleton />
    </div>
  ),
};
