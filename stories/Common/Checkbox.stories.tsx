import type { Meta, StoryObj } from "@storybook/nextjs";

import { BaseCheckBox } from "@/components/shared/checkbox";
import { Checkbox } from "@/components/ui/checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "components/shared/checkbox",
  component: Checkbox,
};

export default meta;

//default checkbox
type Story = StoryObj<typeof Checkbox>;

export const DefaultCheckBox: Story = {
  render: () => (
    <div className="flex flex-col space-y-4">
      <BaseCheckBox label="Default State" id={"check1"} />
      <BaseCheckBox label="Checked State" id={"check2"} checked />
      <BaseCheckBox label="Disabled State" id={"check3"} disabled />
      <BaseCheckBox
        label="Checked&Disabled State"
        id={"check4"}
        disabled
        checked
      />
    </div>
  ),
};
