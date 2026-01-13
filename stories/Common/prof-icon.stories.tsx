import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import { ProfIcon } from "@/components/profile-icon/profile-icon";

const meta: Meta<typeof ProfIcon> = {
  title: "Components/ProfIcon",
  component: ProfIcon,
  argTypes: {
    src: {
      //나중에 실제 이미지를 받아와 넣는 작업 필요
      options: [
        "https://placehold.jp/216de5/ffffff/180x180.png?text=RED", //임시이미지
        "https://placehold.jp/1e293b/ffffff/180x180.png?text=BLUE",
        "https://placehold.jp/10b981/ffffff/180x180.png?text=GREEN",
      ],
      control: { type: "select" },
      description: "이미지 URL을 넣거나 샘플을 선택하세요",
    },
    width: {
      control: { type: "range", min: 50, max: 500, step: 10 },
      description: "아이콘 가로 크기",
    },
    height: {
      control: { type: "range", min: 50, max: 500, step: 10 },
      description: "아이콘 세로 크기",
    },
    alt: { control: "text" },
  },
};
export default meta;

//default profIcon
type Story = StoryObj<typeof ProfIcon>;

export const Default: Story = {
  args: {
    // 180x180 사이즈의 가짜 이미지 URL
    src: "https://placehold.jp/ffffff/000000/180x180.png?text=LOGO",
    width: 180,
    height: 180,
    alt: "임시 로고",
  },
  render: (args) => (
    <div className="flex items-center justify-center p-10">
      <ProfIcon {...args} />
    </div>
  ),
};

export const ProfileSelectDual: Story = {
  render: () => {
    //임시로직
    const [selectedSrc, setSelectedSrc] = useState<string>("");

    const profiles = [
      {
        id: "blue",
        src: "https://placehold.jp/ffffff/000000/180x180.png?text=BLUE",
        label: "블루 아이콘",
      },
      {
        id: "red",
        src: "https://placehold.jp/ffffff/000000/180x180.png?text=RED",
        label: "레드 아이콘",
      },
    ];

    const SELECTED_STYLE = "ring-[8px] ring-frog-600";
    const DEFAULT_STYLE = "ring-[8px] ring-transparent";

    return (
      <div className="flex flex-col items-center gap-12 p-20 bg-slate-50 min-h-[400px]">
        <div className="flex gap-12">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => setSelectedSrc(profile.src)}
              className="cursor-pointer transition-all"
            >
              <ProfIcon
                src={profile.src}
                width={180}
                height={180}
                alt={profile.label}
                className={`${
                  selectedSrc === profile.src ? SELECTED_STYLE : DEFAULT_STYLE
                }`}
              />
            </button>
          ))}
        </div>

        {/* 3. 선택된 결과(src) 표시 영역 */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            src
          </p>
          <div className="bg-white px-6 py-3 rounded-full border border-slate-200 shadow-sm">
            <code className="text-frog-600 font-mono text-sm">
              {selectedSrc}
            </code>
          </div>
        </div>
      </div>
    );
  },
};
