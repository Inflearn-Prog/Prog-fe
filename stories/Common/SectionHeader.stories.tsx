import type { Meta, StoryObj } from "@storybook/nextjs";

import { PageTitleGroup } from "@/components/shared/page-title-group";
import { SectionHeader } from "@/components/shared/section-header";

import { StoryBox } from "../StoryBox";

const meta: Meta<typeof PageTitleGroup> = {
  title: "components/shared/PageTitleGroup",
  component: PageTitleGroup,
  argTypes: {
    title: {
      control: "text",
      description: "페이지 제목을 설정합니다.",
    },
    subtitle: {
      control: "text",
      description: "페이지의 부제목을 설정합니다.",
    },
  },
};

export default meta;
//default PageTitleGroup
type Story = StoryObj<typeof PageTitleGroup>;

export const TitleSection: Story = {
  args: {
    title: "메인 페이지 제목",
    subtitle: "여기에 페이지에 대한 상세 설명을 입력하세요.",
  },
  render: (args) => (
    <StoryBox>
      <div className="flex flex-col gap-12 p-4">
        {/* PageTitleGroup 섹션 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-sm font-medium text-slate-400">
              Page Title Group
            </h3>
            <div className="flex-1 h-1 bg-slate-100" />
          </div>
          <div className="bg-gray-0 p-6 rounded-lg border border-slate-100 shadow-sm">
            <PageTitleGroup {...args} />
          </div>
        </section>

        {/* SectionHeader 섹션 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-sm font-medium text-slate-400">
              Section Header
            </h3>
            <div className="flex-1 h-1 bg-slate-100" />
          </div>
          <div className="bg-gay-0 p-6 rounded-lg border border-slate-100 shadow-sm">
            <SectionHeader {...args} />
          </div>
        </section>
      </div>
    </StoryBox>
  ),
};
