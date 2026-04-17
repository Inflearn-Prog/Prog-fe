// 2026-03-02
// community-type.ts

// 커뮤니티 게시글 기본 타입
interface PromptType {
  id: number;
  title: string;
  preview: string;
  jobCategory: "BACKEND" | "FRONTEND" | "AI" | "ETC";
  likeCount: number;
  copyCount: number;
  authorNickname: string;
  createdAt: string;
  updatedAt: string;
}

// 커뮤니티 게시글 단일 아이템 타입 (CommunityItem 컴포넌트 props로 사용)
export type CommunityPromptItem = Pick<
  PromptType,
  | "id"
  | "title"
  | "preview"
  | "jobCategory"
  | "likeCount"
  | "copyCount"
  | "authorNickname"
  | "createdAt"
>;

// 커뮤니티 게시글 목록 타입 (API 응답값으로 사용)
export type CommunityPrompt = CommunityPromptItem;
