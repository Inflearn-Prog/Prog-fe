export const REASON_TYPE = [
  { label: "광고나 도배글이에요.", value: "SPAM_OR_AD" },
  { label: "불쾌한 표현이 있어요.", value: "INAPPROPRIATE_EXPRESSION" },
  { label: "프롬프트가 설명대로 작동하지 않아요.", value: "NOT_WORKING" },
  { label: "제 창작물(또는 타인의 것)을 도용했어요.", value: "PLAGIARISM" },
  { label: "기타", value: "OTHER" },
];

export interface PromptBase {
  id: string;
  category: string;
  title: string;
  content: string;
  userIcon: string;
  userName: string;
  userDesc: string;
  isLiked?: boolean;
  likes?: number;
}

export interface PromptCardProps extends PromptBase {
  onCopy?: () => void;
  onLike?: (promptId: string, isLiked: boolean) => void;
  onReport?: () => void;
  onPreview?: () => void;
}
export interface BasePrompt {
  promptId: number;
  title: string;
  description: string;
}

// 좋아요 목록 타입
export interface LikedPrompt extends BasePrompt {
  isLiked: boolean;
}

// 내 게시글 목록 타입 (createdAt 필수)
export interface MyPrompt extends BasePrompt {
  createdAt: string;
}

export interface PromptPage {
  items: PromptBase[];
  nextPage: number | null;
  isLast: boolean;
}
