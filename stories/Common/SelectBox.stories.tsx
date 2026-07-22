import type { Meta, StoryObj } from "@storybook/nextjs";
// UI 테스트를 위한 임시 상태
import { fn } from "storybook/test";

import { SelectBox } from "@/components/shared/select-box";

import { StoryBox } from "../StoryBox";

const meta: Meta<typeof SelectBox> = {
  title: "Components/Shared/select-box",
  component: SelectBox,
  argTypes: {
    value: {
      control: { type: "text" as const },
      description: "선택된 값입니다.",
    },
    onValueChange: {
      control: false,
      action: "onValueChange",
      description: "값이 변경될 때 호출되는 콜백 함수입니다.",
      table: {
        type: { summary: "(value: string) => void" },
        category: "Events",
      },
    },
    disabled: {
      control: { type: "boolean" as const },
      options: [true, false],
      description: "셀렉트 박스의 비활성화 상태를 설정합니다.",
    },
    required: {
      control: { type: "boolean" as const },
      options: [true, false],
      description: "셀렉트 박스가 필수 입력인지 여부를 설정합니다.",
    },
    selectOptions: {
      control: { type: "object" as const },
      description: "셀렉트 박스에 표시할 옵션들의 배열입니다.",
      table: {
        type: {
          summary: "SelectOption[]",
          detail: "{label: string, value: string}[]",
        },
      },
      default: { summary: "[]" },
      category: "Data",
    },
    name: {
      control: { type: "text" as const },
      description: "폼 제출 시 사용되는 셀렉트 박스의 이름입니다.",
    },
    placeholder: {
      control: { type: "text" as const },
      description: "선택된 값이 없을 때 표시되는 플레이스홀더 텍스트입니다.",
    },
    id: {
      control: { type: "text" as const },
      description: "셀렉트 박스의 id 속성입니다.",
    },
  },
  args: {
    value: "",
    onValueChange: fn(),
    selectOptions: [
      { label: "사과", value: "Apple" },
      { label: "바나나", value: "Banana" },
      { label: "체리", value: "Cherry" },
    ],

    placeholder: "과일을 선택해주세요",
    disabled: false,
    required: false,
    name: "fruit",
    id: "fruit-select",
  },
};

export default meta;

type Story = StoryObj<typeof SelectBox>;

export const DefaultTerms: Story = {
  render: (args) => {
    return (
      <div>
        <SelectBox {...args} />
      </div>
    );
  },
};

export const DisabledSelectBox: Story = {
  args: {
    disabled: true,
  },
  render: (args) => {
    return (
      <StoryBox>
        <SelectBox {...args} />
      </StoryBox>
    );
  },
};

export const AllOptions: Story = {
  render: (args) => {
    return (
      <StoryBox>
        <div className="flex gap-2 flex-wrap w-[50dvw] border p-4 rounded">
          <div className="flex gap-2 w-full">
            <SelectBox {...args} />

            <SelectBox {...args} disabled />
          </div>
        </div>
      </StoryBox>
    );
  },
};
