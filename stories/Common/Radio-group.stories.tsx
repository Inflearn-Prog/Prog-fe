import type { Meta, StoryObj } from "@storybook/nextjs";

import { BaseRadioItem } from "@/components/shared/radioitem";
import { RadioGroup } from "@/components/ui/radio-group";

const meta: Meta<typeof BaseRadioItem> = {
  title: "components/shared/radio-group",
  component: BaseRadioItem,
};

export default meta;

//default radio group
type Story = StoryObj<typeof BaseRadioItem>;

export const DefaultRadioGroup: Story = {
  render: () => (
    <RadioGroup defaultValue="selected">
      <BaseRadioItem id="r1" value="default" label="Default" />
      <BaseRadioItem id="r2" value="selected" label="Selected" />
      <BaseRadioItem id="r3" value="disabled" label="Disabled" disabled />
      <BaseRadioItem
        id="r4"
        value="selected&disabled"
        label="Selected&Disabled"
        disabled
        checked
      />
    </RadioGroup>
  ),
};
