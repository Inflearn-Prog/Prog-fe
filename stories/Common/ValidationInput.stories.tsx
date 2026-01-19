import type { Meta, StoryObj } from "@storybook/nextjs";

import { ValidationInput } from "@/components/shared/validation-input";

const meta: Meta<typeof ValidationInput> = {
  title: "components/shared/ValidationInput",
  component: ValidationInput,
  args: {
    name: "validation-input",
    placeholder: "내용을 입력해주세요.",
    message: "도움말 메시지가 여기에 표시됩니다.",
    messageType: "default",
  },
  argTypes: {
    messageType: {
      control: "select",
      options: ["default", "success", "error"],
    },
    inputSize: {
      control: "select",
      options: ["md", "lg"],
    },
    rounded: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ValidationInput>;

export const Default: Story = {};

export const Success: Story = {
  args: {
    messageType: "success",
    message: "사용 가능한 아이디입니다.",
  },
};

export const Error: Story = {
  args: {
    messageType: "error",
    message: "이미 사용 중인 아이디입니다.",
  },
};

// 2. 종합 스토리: 기존처럼 한눈에 비교하고 싶을 때 사용
export const Comparison: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8 w-full max-w-lg">
      <div>
        <h3 className="text-sm font-bold mb-2 text-slate-400">Default State</h3>
        <ValidationInput {...args} messageType="default" />
      </div>
      <div>
        <h3 className="text-sm font-bold mb-2 text-slate-400">Success State</h3>
        <ValidationInput
          {...args}
          messageType="success"
          message="조건을 충족했습니다."
        />
      </div>
      <div>
        <h3 className="text-sm font-bold mb-2 text-slate-400">Error State</h3>
        <ValidationInput
          {...args}
          messageType="error"
          message="다시 시도해주세요."
        />
      </div>
    </div>
  ),
};
