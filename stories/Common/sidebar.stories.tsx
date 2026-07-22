import type { Meta, StoryObj } from "@storybook/nextjs";

import { ProgSidebar } from "@/components/sidebar/category-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

import { StoryBox } from "../StoryBox";

const STORY_PARAMETERS = {
  layout: "centered" as const,
  docs: {
    description: {
      component: "사이드바 컴포넌트들의 다양한 상태와 변형을 보여줍니다.",
    },
  },
  nextjs: {
    appDirectory: true,
    navigation: {
      pathname: "/rank", // rank 기본 경로로 설정
    },
  },
};

const MOCK_PATHNAMES = {
  RANK: "/rank",
  COMMUNITY: "/community",
};

const ProgSidebarMeta: Meta<typeof ProgSidebar> = {
  title: "Components/Sidebar/ProgSidebar",
  component: ProgSidebar,
  parameters: STORY_PARAMETERS,
  argTypes: {},
  args: {},
  decorators: [
    (Story) => (
      <div className="w-full grid grid-cols-12 max-w-7xl mx-auto gap-4 p-4">
        <div className="col-span-3">
          <SidebarProvider>
            <Story />
          </SidebarProvider>
        </div>
      </div>
    ),
  ],
};

export default ProgSidebarMeta;

type ProgSidebarStory = StoryObj<typeof ProgSidebar>;

// ProgSidebar 기본 스토리
export const Default: ProgSidebarStory = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: MOCK_PATHNAMES.RANK,
      },
    },
  },
  render: () => (
    <StoryBox>
      <ProgSidebar />
    </StoryBox>
  ),
};

export const CommunitySidebar: ProgSidebarStory = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: MOCK_PATHNAMES.COMMUNITY,
      },
    },
  },
  render: () => (
    <StoryBox>
      <ProgSidebar />
    </StoryBox>
  ),
};

export const RankCategorySelected: ProgSidebarStory = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/rank/algorithm",
      },
    },
  },
  render: () => (
    <StoryBox>
      <ProgSidebar />
    </StoryBox>
  ),
};
