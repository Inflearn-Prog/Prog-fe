import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import UserExperience from "@/components/mypage/user-experience";

const meta: Meta<typeof UserExperience> = {
  title: "Components/Mypage/UserExperience",
  component: UserExperience,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "경험",
    placeholder: "경험을 입력해주세요",
    onChange: () => {},
  },
  argTypes: {
    label: {
      control: { type: "text" },
      description: "라벨",
    },
    placeholder: {
      control: { type: "text" },
      description: "placeholder 텍스트",
    },
    maxItems: {
      control: { type: "number" },
      description: "입력 가능한 최대 아이템 개수",
    },
    value: {
      control: "object",
      description: "현재 입력된 경험 리스트",
    },
  },
};

export default meta;
type Story = StoryObj<typeof UserExperience>;

/**
 * 1. 기본 상태 (상태 변화 확인용)
 * 실제 입력과 삭제가 동작하도록 useState를 연결한 래퍼입니다.
 */
export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>(args.value || []);
    return (
      <div className="w-[400px]">
        <UserExperience {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  args: {
    value: [],
    maxItems: 3,
  },
};

/**
 * 2. 초기 데이터가 있는 상태
 */
export const DefaultWithData: Story = {
  args: {
    value: ["Google Software Engineer 인턴", "교내 해커톤 대상 수상"],
    maxItems: 3,
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * 3. 최대 개수에 도달한 상태 (입력창이 사라짐)
 */
export const MaxReached: Story = {
  args: {
    value: ["경험 1", "경험 2", "경험 3"],
    maxItems: 3,
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * 4. 많은 개수를 허용할 때
 */
export const ManyItemsAllowed: Story = {
  args: {
    value: ["리액트 공부", "타입스크립트 공부"],
    maxItems: 10,
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};
