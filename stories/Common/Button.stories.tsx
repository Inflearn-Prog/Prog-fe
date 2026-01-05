import type { Meta, StoryObj } from "@storybook/nextjs";
import { ChevronRight } from "lucide-react"; // 아이콘 예시용

import { BaseButton, RoundButton } from "@/components/shared/button";
import { Button } from "@/components/ui/button";

//컨트롤패널
const meta: Meta<typeof Button> = {
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

export const AllButtons: StoryObj<typeof Button> = {
  render: () => (
    <div className="flex flex-col gap-10 p-4">
      {/* 1. BaseButton */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold border-b pb-2">Base Buttons</h3>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-400 font-mono">
              Default (Frog)
            </span>
            <BaseButton>Base Default</BaseButton>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-400 font-mono">
              Secondary (Gray)
            </span>
            <BaseButton variant="secondary">Base Secondary</BaseButton>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-400 font-mono">Destructive</span>
            <BaseButton variant="destructive">Base Destructive</BaseButton>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-400 font-mono">Disabled</span>
            <BaseButton disabled>Disabled</BaseButton>
          </div>
        </div>
      </section>

      {/* 2. RoundButton */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold border-b pb-2">Round Buttons</h3>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-400 font-mono">
              Default (Frog)
            </span>
            <RoundButton>Round Default</RoundButton>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-400 font-mono">
              Secondary (Gray)
            </span>
            <RoundButton variant="secondary">Round Secondary</RoundButton>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-400 font-mono">Outline</span>
            <RoundButton variant="outline">Round Outline</RoundButton>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-400 font-mono">Small Size</span>
            <RoundButton size="sm">Round SM</RoundButton>
          </div>
        </div>
      </section>

      {/* 3. 비교 */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold border-b pb-2">Shape Comparison</h3>
        <div className="flex gap-4">
          <BaseButton variant="default">Base Shape</BaseButton>
          <RoundButton variant="default">Round Shape</RoundButton>
        </div>
      </section>
    </div>
  ),
};
