import type { Meta, StoryObj } from "@storybook/nextjs";

import PromptCard from "@/components/prompt/prompt-card";

import { StoryBox } from "../StoryBox";

const meta: Meta<typeof PromptCard> = {
  title: "Components/Prompt/PromptCard",
  component: PromptCard,
  tags: ["autodocs"],
  argTypes: {
    category: { control: "text" },
    onCopy: { action: "copied" },
    onLike: { action: "liked" },
    onReport: { action: "reported" },
    onPreview: { action: "previewed" },
  },
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
    category: "개발",
    title: "자소서를 위한 GPT 프롬프트 제목",
    content: "자소서를 위한 GPT 프롬프트 설명입니다.",
    userIcon: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    userName: "닉네임",
    userDesc: "유저 설명",
  },
};
