// 작성날짜: 2026-01-17
// 파일명: Toast.stories.tsx
// Storybook 공식문서: https://storybook.js.org/docs/react/writing-stories/introduction
// Sonner 공식문서: https://sonner.emilkowal.ski

import type { Meta, StoryObj } from "@storybook/nextjs";
import { Toaster } from "sonner";

import { toasts } from "@/components/shared/toast";

import { StoryBox } from "../StoryBox";

/**
 * Toast 컴포넌트 스토리
 *
 * Sonner 라이브러리 기반 Toast 알림 컴포넌트
 * 성공 메시지를 사용자에게 표시할 때 사용
 */
const meta = {
  title: "Common/Toast",
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        {/* Sonner Toaster 컴포넌트 필수 */}
        <Toaster />
      </>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 성공 Toast
 *
 * 게시글 등록, 저장 등 성공 작업 완료 시 표시
 */
export const Success: Story = {
  render: () => {
    const handleClick = () => {
      try {
        toasts().success("게시글이 성공적으로 등록되었습니다.");
      } catch (error) {
        console.error("Toast 표시 중 오류 발생:", error);
      }
    };

    return (
      <StoryBox>
        <div className="flex flex-col gap-4 items-center">
          <h3 className="heading-small text-gray-900">Toast 성공 메시지</h3>
          <p className="body-medium text-gray-600 text-center">
            버튼을 클릭하면 하단 중앙에 Toast가 표시됩니다.
          </p>
          <button
            onClick={handleClick}
            className="px-6 py-3 bg-frog-600 text-white rounded-md hover:bg-frog-700 transition-colors label-large"
          >
            성공 Toast 표시
          </button>
        </div>
      </StoryBox>
    );
  },
};

/**
 * 짧은 메시지 Toast
 *
 * 간단한 액션 완료 메시지
 */
export const ShortMessage: Story = {
  render: () => {
    const handleClick = () => {
      try {
        toasts().success("저장되었습니다.");
      } catch (error) {
        console.error("Toast 표시 중 오류 발생:", error);
      }
    };

    return (
      <StoryBox theme="blue">
        <div className="flex flex-col gap-4 items-center">
          <h3 className="heading-small text-gray-900">짧은 메시지 Toast</h3>
          <button
            onClick={handleClick}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors label-large"
          >
            짧은 메시지 표시
          </button>
        </div>
      </StoryBox>
    );
  },
};

/**
 * 긴 메시지 Toast
 *
 * 상세한 성공 메시지 표시
 */
export const LongMessage: Story = {
  render: () => {
    const handleClick = () => {
      try {
        toasts().success(
          "회원가입이 완료되었습니다. 이메일로 전송된 인증 링크를 확인해주세요."
        );
      } catch (error) {
        console.error("Toast 표시 중 오류 발생:", error);
      }
    };

    return (
      <StoryBox theme="green">
        <div className="flex flex-col gap-4 items-center">
          <h3 className="heading-small text-gray-900">긴 메시지 Toast</h3>
          <button
            onClick={handleClick}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors label-large"
          >
            긴 메시지 표시
          </button>
        </div>
      </StoryBox>
    );
  },
};

/**
 * 다양한 메시지 예시
 *
 * 실제 사용 시나리오별 Toast 메시지
 */
export const VariousMessages: Story = {
  render: () => {
    const messages = [
      { label: "게시글 등록", message: "게시글이 성공적으로 등록되었습니다." },
      { label: "댓글 작성", message: "댓글이 작성되었습니다." },
      { label: "프로필 수정", message: "프로필이 업데이트되었습니다." },
      { label: "파일 업로드", message: "파일이 성공적으로 업로드되었습니다." },
      { label: "설정 저장", message: "설정이 저장되었습니다." },
      { label: "공유 완료", message: "링크가 복사되었습니다." },
    ];

    const handleClick = (message: string) => {
      try {
        toasts().success(message);
      } catch (error) {
        console.error("Toast 표시 중 오류 발생:", error);
      }
    };

    return (
      <StoryBox theme="purple">
        <div className="flex flex-col gap-4 items-center max-w-2xl">
          <h3 className="heading-small text-gray-900">
            다양한 시나리오별 Toast
          </h3>
          <p className="body-small text-gray-600 text-center">
            실제 서비스에서 사용되는 다양한 성공 메시지 예시
          </p>
          <div className="grid grid-cols-2 gap-3 w-full">
            {messages.map((item) => (
              <button
                key={item.label}
                onClick={() => handleClick(item.message)}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors label-medium"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </StoryBox>
    );
  },
};

/**
 * 연속 Toast 표시
 *
 * 여러 개의 Toast를 연속으로 표시하는 예시
 */
export const MultipleToasts: Story = {
  render: () => {
    const handleClick = () => {
      try {
        toasts().success("첫 번째 작업이 완료되었습니다.");

        setTimeout(() => {
          toasts().success("두 번째 작업이 완료되었습니다.");
        }, 500);

        setTimeout(() => {
          toasts().success("세 번째 작업이 완료되었습니다.");
        }, 1000);
      } catch (error) {
        console.error("Toast 표시 중 오류 발생:", error);
      }
    };

    return (
      <StoryBox theme="orange">
        <div className="flex flex-col gap-4 items-center">
          <h3 className="heading-small text-gray-900">연속 Toast 표시</h3>
          <p className="body-small text-gray-600 text-center">
            여러 개의 Toast가 순차적으로 표시됩니다.
          </p>
          <button
            onClick={handleClick}
            className="px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors label-large"
          >
            연속 Toast 표시
          </button>
        </div>
      </StoryBox>
    );
  },
};
