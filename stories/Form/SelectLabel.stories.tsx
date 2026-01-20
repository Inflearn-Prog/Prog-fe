import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
// UI 테스트를 위한 임시 상태
import { fn } from "storybook/test";

import { SelectLabel } from "@/components/forms";

import { StoryBox } from "../StoryBox";

const meta: Meta<typeof SelectLabel> = {
  title: "Components/Form/SelectLabel",
  component: SelectLabel,
  argTypes: {
    value: {
      control: { type: "text" as const },
      description: "셀렉트 박스의 값입니다.",
    },
    onValueChange: {
      action: "changed",
      description: "셀렉트 박스의 값이 변경될 때 호출되는 콜백 함수입니다.",
    },
    disabled: {
      control: { type: "boolean" as const },
      description: "셀렉트 박스가 비활성화 상태인지 여부입니다.",
      options: [true, false],
    },
    required: {
      control: { type: "boolean" as const },
      description: "셀렉트 박스가 필수 입력인지 여부입니다.",
      options: [true, false],
    },
    selectOptions: {
      control: { type: "object" as const },
      description: "셀렉트 박스의 옵션 목록입니다.",
    },
    name: {
      control: { type: "text" as const },
      description: "셀렉트 박스의 name 속성입니다.",
    },
    placeholder: {
      control: { type: "text" as const },
      description: "셀렉트 박스의 placeholder 텍스트입니다.",
    },
    triggerRef: {
      control: { type: "object" as const },
      description: "셀렉트 박스의 트리거 버튼에 대한 ref입니다.",
    },
    label: {
      control: { type: "text" as const },
      description: "셀렉트 박스의 라벨 텍스트입니다.",
    },
  },
  args: {
    value: "",
    onValueChange: fn(),
    disabled: false,
    required: false,
    selectOptions: [
      { value: "option1", label: "옵션 1" },
      { value: "option2", label: "옵션 2" },
      { value: "option3", label: "옵션 3" },
    ],
    name: "select",
    placeholder: "옵션을 선택해주세요",
    triggerRef: null,
    label: "라벨 텍스트",
  },
};

export default meta;

type Story = StoryObj<typeof SelectLabel>;

export const Default: Story = {
  render: (args) => {
    return (
      <StoryBox>
        <SelectLabel {...args} />
      </StoryBox>
    );
  },
};

export const TestSelect: Story = {
  args: {
    label: "총 경력",
    htmlFor: "career",
    placeholder: "총 경력을 입력해주세요",
  },
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <StoryBox>
        <SelectLabel
          {...args}
          value={value}
          onValueChange={(e) => setValue(e.toString())}
        />
      </StoryBox>
    );
  },
};
