import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import { Board, BoardViewer } from "@/components/board/board";

import { StoryBox } from "../StoryBox";

const meta: Meta<typeof Board> = {
  title: "components/Form/BoardEditor",
  component: Board,
  argTypes: {
    value: {
      control: { type: "text" as const },
      description: "텍스트 에디터 값",
    },
    setValue: {
      control: {
        type: "object" as const,
      },
      action: {
        type: "setValue",
        description: "텍스트 에디터 값 변경 함수",
      },
      description: "텍스트 에디터 값 변경 함수",
    },
    placeholder: {
      control: { type: "text" as const },
      description: "텍스트 에디터 플레이스홀더",
    },
  },
};

export default meta;

//default checkbox
type Story = StoryObj<typeof Board>;

export const Default: Story = {
  args: {
    placeholder: "내용을 입력해주세요",
  },
  render: (args) => {
    const [data, setData] = useState("");
    return (
      <StoryBox>
        <div>
          board Data: <p>{data}</p>
        </div>
        <Board {...args} value={data} setValue={setData} />
      </StoryBox>
    );
  },
};

export const BoardAndViewer: Story = {
  args: {
    placeholder: "내용을 입력해주세요",
  },
  render: (args) => {
    const [data, setData] = useState("");
    return (
      <StoryBox>
        <div className="mb-4 bg-white p-4">
          <h2>보드 내용</h2>
          <BoardViewer content={data} />
        </div>
        <div className="mb-8">
          <Board {...args} value={data} setValue={setData} />
        </div>
      </StoryBox>
    );
  },
};
