// 작성날짜: 2026-01-12
// 파일명: Header.stories.tsx
// Storybook 공식문서: https://storybook.js.org/docs/react/writing-stories/introduction

import { Meta, StoryObj } from "@storybook/nextjs";

import { Header } from "@/components/header/header";

import { StoryBox } from "../StoryBox";

/**
 * 헤더 컴포넌트 스토리북
 * @description 사이트 전역 헤더 컴포넌트의 다양한 상태를 확인할 수 있습니다
 */
const meta: Meta<typeof Header> = {
  title: "components/Header/Header",
  component: Header,
  parameters: {
    layout: "fullscreen", // 헤더는 전체 너비로 표시
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Header>;

/**
 * 기본 헤더
 */
export const Default: Story = {
  render: () => (
    <StoryBox>
      <Header />
    </StoryBox>
  ),
};

/**
 * 배경이 있는 헤더 (시각적 구분용)
 */
export const WithBackground: Story = {
  render: () => (
    <StoryBox>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="p-10">
          <h1 className="text-2xl font-bold">페이지 컨텐츠 영역</h1>
          <p className="mt-4 text-gray-600">
            헤더 아래에 표시되는 컨텐츠입니다.
          </p>
        </div>
      </div>
    </StoryBox>
  ),
};

/**
 * 스크롤 가능한 페이지에서의 헤더
 */
export const WithScrollContent: Story = {
  render: () => (
    <StoryBox>
      <Header />
      <div className="p-10 space-y-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="p-4 bg-white border rounded">
            <h2 className="font-semibold">컨텐츠 블록 {i + 1}</h2>
            <p className="text-gray-600">
              스크롤 테스트를 위한 더미 컨텐츠입니다.
            </p>
          </div>
        ))}
      </div>
    </StoryBox>
  ),
};
