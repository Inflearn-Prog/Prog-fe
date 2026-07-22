import type { Meta, StoryObj } from "@storybook/nextjs";

import { AuthProvider } from "@/app/(beforeLogin)/(auth)/constant";
import UserProfile from "@/components/mypage/user-profile";

const meta: Meta<typeof UserProfile> = {
  title: "Components/Mypage/UserProfile",
  component: UserProfile,
  tags: ["autodocs"],
  argTypes: {
    provider: {
      control: "radio",
      options: ["kakao", "naver"],
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm mx-auto mt-10">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof UserProfile>;

/** 1. 카카오 로그인 사용자 케이스 */
export const KakaoProfile: Story = {
  args: {
    nickname: "라이언",
    email: "ryan@kakao.com",
    provider: AuthProvider.KAKAO,
    introduction: "안녕하세요, 카카오에서 온 라이언입니다. 즐거운 하루 되세요!",
  },
};

/** 2. 네이버 로그인 사용자 케이스 */
export const NaverProfile: Story = {
  args: {
    nickname: "그린팩토리",
    email: "naver_user@naver.com",
    provider: AuthProvider.NAVER,
    introduction: "네이버 프로필입니다. 초록색 배경이 특징이에요.",
  },
};

/** 3. 긴 소개글 테스트 케이스 */
export const LongIntroduction: Story = {
  args: {
    nickname: "글자수테스트",
    email: "test@example.com",
    provider: AuthProvider.KAKAO,
    introduction:
      "소개글이 아주 길어질 경우 레이아웃이 어떻게 변하는지 확인하기 위한 케이스입니다. ".repeat(
        3
      ),
  },
};
