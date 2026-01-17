import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import { ProfIcon } from "@/components/profile-icon/profile-icon";
import { cn } from "@/lib/utils";

const meta: Meta<typeof ProfIcon> = {
  title: "Components/shared/ProfIcon",
  component: ProfIcon,
  argTypes: {
    src: { description: "이미지 URL" },
    width: { control: { type: "range", min: 50, max: 300, step: 10 } },
    height: { control: { type: "range", min: 50, max: 300, step: 10 } },
    fallback: { description: "이미지 부재 시 노출될 텍스트" },
  },
};
export default meta;

type Story = StoryObj<typeof ProfIcon>;

/**
 * default
 */
export const Default: Story = {
  args: {
    src: "https://placehold.jp/1e293b/ffffff/180x180.png?text=PROF",
    width: 180,
    height: 180,
    alt: "기본 프로필",
    fallback: "P",
  },
};

/**
 * 이미지가 없을 때 글자가 보이도록
 */
export const NoImage: Story = {
  args: {
    src: "",
    width: 180,
    height: 180,
    alt: "이미지 없음",
    fallback: "None",
  },
};

/**
 * 프로필 아이콘 선택
 */
export const ProfileSelect: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const profiles = [
      {
        id: "image-exists",
        src: "https://placehold.jp/1e293b/ffffff/180x180.png?text=IMG",
        label: "I",
      },
      {
        id: "image-empty",
        src: "", // 혹은 null
        label: "F",
      },
    ];

    const selectedProfile = profiles.find((p) => p.id === selectedId);

    return (
      <div className="flex flex-col items-center gap-10 p-20 bg-slate-50">
        <div className="flex gap-10">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => setSelectedId(profile.id)}
              className={cn(
                "rounded-full transition-all duration-300",
                selectedId === profile.id && "ring-8 ring-frog-600"
              )}
            >
              <ProfIcon
                src={profile.src}
                width={180}
                height={180}
                alt={profile.label}
                fallback={profile.label}
              />
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Current Selected Src
          </p>
          <div className="bg-white px-6 py-3 rounded-full border border-slate-200 shadow-sm text-center">
            <code className="text-frog-600 font-mono text-sm">
              {/* 선택은 됐는데 src가 비어있을 경우에 대한 표시 처리 */}
              {selectedId === null
                ? "프로필을 선택해주세요"
                : selectedProfile?.src === ""
                  ? "NULL"
                  : selectedProfile?.src}
            </code>
          </div>
        </div>
      </div>
    );
  },
};
