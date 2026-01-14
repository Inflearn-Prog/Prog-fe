import type { Meta, StoryObj } from "@storybook/nextjs";

import { ValidationInput } from "@/components/shared/validation-input";

const meta: Meta<typeof ValidationInput> = {
  title: "components/shared/ValidationInput",
  component: ValidationInput,
  argTypes: {
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

export const AllValidationInput: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8 w-full max-w-lg">
      <div>
        <h3 className="text-sm font-bold mb-2">1. Default</h3>
        <ValidationInput
          {...args}
          name="default"
          message=" "
          placeholder="닉네임을 입력해주세요."
        />
      </div>

      <div>
        <h3 className="text-sm font-bold mb-2">2. Success</h3>
        <ValidationInput
          {...args}
          name="success"
          message="사용 가능한 아이디입니다."
          className="text-[#04B014]"
          placeholder="닉네임을 입력해주세요."
        />
      </div>

      <div>
        <h3 className="text-sm font-bold mb-2">3. Error</h3>
        <ValidationInput
          {...args}
          name="error"
          message="사용할 수 없는 아이디입니다."
          className="text-red-500"
          placeholder="닉네임을 입력해주세요."
        />
      </div>
    </div>
  ),
};
