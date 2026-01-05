import type { Meta, StoryObj } from "@storybook/nextjs";
import { ChevronRight } from "lucide-react"; // 아이콘 예시용

import { BaseButton, RoundButton } from "@/components/shared/button";
import { Button } from "@/components/ui/button";

//컨트롤패널
const meta: Meta<typeof BaseButton> = {
  title: "components/shared/button",
  component: BaseButton,
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
      description: "버튼의 스타일 변경합니다",
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon", "icon-sm", "icon-lg"],
      description: "버튼의 사이즈를 변경합니다",
    },
    shape: {
      control: "inline-radio",
      options: ["default", "round"],
      description: "버튼의 모서리 모양을 변경합니다",
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
//default 버튼
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button",
    variant: "default",
    size: "default",
    shape: "default",
  },
};

// Base Button Story
export const AsBaseButton: StoryObj<typeof BaseButton> = {
  render: (args) => <BaseButton {...args}>Base Button</BaseButton>,
};

// Round Button Story
export const AsRoundButton: StoryObj<typeof RoundButton> = {
  render: (args) => <RoundButton {...args}>Round Button</RoundButton>,
};

//icon button story
export const WithIcon: Story = {
  args: {
    variant: "secondary",
    children: (
      <>
        <ChevronRight />
      </>
    ),
  },
};
