import type { Meta, StoryObj } from "@storybook/nextjs";

// 아이콘 예시용
import { SearchEmpty } from "@/components/search/search-empty";

import { StoryBox } from "../StoryBox";

//컨트롤패널
const meta: Meta<typeof SearchEmpty> = {
  title: "components/Search/SearchEmpty",
  component: SearchEmpty,
  argTypes: {},
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
//default 버튼
type Story = StoryObj<typeof SearchEmpty>;

export const Default: Story = {
  render: () => (
    <StoryBox>
      <div className="flex items-center justify-center h-96">
        <SearchEmpty />
      </div>
    </StoryBox>
  ),
};
