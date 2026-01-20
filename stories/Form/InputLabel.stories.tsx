import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
// UI 테스트를 위한 임시 상태
import { fn } from "storybook/test";

import { InputLabel } from "@/components/forms";

import { StoryBox } from "../StoryBox";

const meta: Meta<typeof InputLabel> = {
  title: "Components/Form/input-label",
  component: InputLabel,
  argTypes: {
    label: {
      control: { type: "text" as const },
      description: "인풋의 라벨 텍스트입니다.",
    },
    htmlFor: {
      control: { type: "text" as const },
      description: "라벨과 인풋을 연결하는 htmlFor 속성입니다.",
    },
    value: {
      control: { type: "text" as const },
      description: "인풋의 값입니다.",
    },
    onChange: {
      action: "changed",
      description: "인풋의 값이 변경될 때 호출되는 콜백 함수입니다.",
    },
    placeholder: {
      control: { type: "text" as const },
      description: "인풋의 플레이스홀더 텍스트입니다.",
    },
    disabled: {
      control: { type: "boolean" as const },
      description: "인풋이 비활성화 상태인지 여부입니다.",
      options: [true, false],
    },
    required: {
      control: { type: "boolean" as const },
      description: "인풋이 필수 입력인지 여부입니다.",
      options: [true, false],
    },
    name: {
      control: { type: "text" as const },
      description: "인풋의 name 속성입니다.",
    },
  },
  args: {
    label: "이름",
    htmlFor: "name",
    value: "",
    onChange: fn(),
    placeholder: "이름을 입력해주세요",
    disabled: false,
    required: false,
    name: "name",
  },
};

export default meta;

type Story = StoryObj<typeof InputLabel>;

export const Default: Story = {
  render: (args) => {
    return (
      <StoryBox>
        <InputLabel {...args} />
      </StoryBox>
    );
  },
};

export const TestInput: Story = {
  args: {
    label: "총 경력",
    htmlFor: "career",
    placeholder: "총 경력을 입력해주세요",
    maxLength: 100,
    viewLength: true,
  },
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <StoryBox>
        <InputLabel
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </StoryBox>
    );
  },
};
