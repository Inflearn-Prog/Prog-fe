import type { Meta, StoryObj } from "@storybook/nextjs";

import { BaseInput } from "@/components/shared/inputs";
import { ValidationMessage } from "@/components/shared/validation-message";

import { StoryBox } from "../StoryBox";

const meta: Meta<typeof ValidationMessage> = {
  title: "components/shared/ValidationMessage",
  component: ValidationMessage,
  args: {
    name: "validation-input",
    message: "도움말 메시지가 여기에 표시됩니다.",
    messageType: "default",
  },
  argTypes: {
    messageType: {
      control: "select",
      options: ["default", "success", "error", "warning"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ValidationMessage>;

export const Default: Story = {
  render: (args) => (
    <StoryBox>
      <BaseInput name={args.name!} />
      <div className="min-h-6">
        <ValidationMessage {...args} />
      </div>
    </StoryBox>
  ),
};
