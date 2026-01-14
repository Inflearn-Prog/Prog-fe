import type { Meta, StoryObj } from "@storybook/nextjs";

// 아이콘 예시용
import { SearchTitle } from "@/components/search/search-title";

//컨트롤패널
const meta: Meta<typeof SearchTitle> = {
  title: "components/Search/SearchTitle",
  component: SearchTitle,
  argTypes: {
    search: {
      control: "text",
      description: "검색어 텍스트",
      defaultValue: "프롬프트",
    },
    searchLength: {
      control: "number",
      description: "검색 결과 수",
      defaultValue: 1234,
    },
  },
};

export default meta;
//default 버튼
type Story = StoryObj<typeof SearchTitle>;

export const Default: Story = {
  args: {
    search: "프롬프트",
    searchLength: 1234,
  },
};

export const EmptySearch: Story = {
  args: {
    search: "",
  },
  render: (args) => (
    <div className="flex items-center gap-2">
      <SearchTitle {...args} />
    </div>
  ),
};
