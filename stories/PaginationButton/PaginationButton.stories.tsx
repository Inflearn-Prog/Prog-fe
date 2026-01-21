import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import { PaginationButton } from "@/components/pagination-button/pagination-button";
import { PaginationButtonSkeleton } from "@/components/pagination-button/pagination-button-skeleton";

import { StoryBox } from "../StoryBox";

const meta: Meta<typeof PaginationButton> = {
  title: "Components/Pagination/PaginationButton",
  component: PaginationButton,
  tags: ["autodocs"],
  argTypes: {
    currentPage: {
      control: { type: "number", min: 1 },
      description: "현재 활성화된 페이지 번호입니다.",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "1" },
      },
    },
    totalPages: {
      control: { type: "number", min: 1 },
      description: "전체 페이지 수입니다.",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "10" },
      },
    },
    onPageChange: {
      action: "pageChanged",
      description: "페이지가 변경될 때 호출되는 콜백 함수입니다.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof PaginationButton>;

export const DefaultState: Story = {
  render: (args) => {
    const [page, setPage] = useState(1);
    return (
      <StoryBox theme={"orange"}>
        <PaginationButton
          {...args}
          currentPage={page}
          totalPages={999}
          onPageChange={(nextPage) => setPage(nextPage)}
        />
      </StoryBox>
    );
  },
};

export const Loading: Story = {
  render: () => (
    <StoryBox theme={"orange"}>
      <PaginationButtonSkeleton />
    </StoryBox>
  ),
};
