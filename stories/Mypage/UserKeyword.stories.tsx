import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import UserKeyword from "@/components/mypage/user-keyword";

const meta: Meta<typeof UserKeyword> = {
  title: "Components/Mypage/UserKeyword",
  component: UserKeyword,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: { type: "text" },
      description: "라벨 텍스트",
    },
    maxTags: {
      control: { type: "number" },
      description: "입력 가능한 최대 태그 개수",
    },
    value: {
      control: "object",
      description: "현재 입력된 키워드 배열",
    },
  },
};

export default meta;
type Story = StoryObj<typeof UserKeyword>;

/**
 * 1. 인터렉티브 상태 (실제 동작 확인)
 */
export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>(args.value || []);
    return (
      <div className="w-[800px]">
        <UserKeyword {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  args: {
    value: [],
    maxTags: 5,
    placeholder: "키워드 입력 후 Enter",
  },
};

/**
 * 2. 태그가 이미 여러 개 있는 상태
 */
export const WithTags: Story = {
  args: {
    value: ["React", "Next.js", "TypeScript", "TailwindCSS"],
    maxTags: 5,
  },
  decorators: [
    (Story) => (
      <div className="w-[800px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * 3. 최대 개수에 도달한 상태 (Disabled)
 * 인풋이 비활성화됩니다.
 */
export const MaxTagsReached: Story = {
  args: {
    value: ["열정맨", "성실함", "소통왕", "문제해결사", "긍정주의자"],
    maxTags: 5,
  },
  decorators: [
    (Story) => (
      <div className="w-[800px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * 4. 긴 텍스트 태그 테스트
 * 태그가 길어질 때 줄바꿈(flex-wrap)이 잘 일어나는지 확인합니다.
 */
export const LongTagTest: Story = {
  args: {
    value: [
      "아주아주긴키워드테스트입니다",
      "이것또한매우매우매우매우긴키워드",
      "짧은키워드",
    ],
    maxTags: 8,
  },
  decorators: [
    (Story) => (
      <div className="w-[800px]">
        <Story />
      </div>
    ),
  ],
};
