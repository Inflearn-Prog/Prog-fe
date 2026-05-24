export const REASON_TYPE = [
  { label: "광고나 도배글이에요.", value: "SPAM_AD" },
  { label: "불쾌한 표현이 있어요.", value: "INAPPROPRIATE_EXPRESSION" },
  { label: "프롬프트가 설명대로 작동하지 않아요.", value: "NOT_WORKING" },
  { label: "제 창작물(또는 타인의 것)을 도용했어요.", value: "PLAGIARISM" },
  { label: "기타", value: "OTHER" },
];

export interface Category {
  categoryId: number;
  name: string;
  description: string;
}

export interface PromptBase {
  promptId: number;
  userId?: number;
  nickname?: string;
  category: Category;
  title: string;
  contentSummary?: string;
  userIcon?: string;
  userName?: string;
  userDesc?: string;
  copyCount?: number;
  isLiked?: boolean;
  likes?: number;
  createdAt: string;
  updatedAt?: string | null;
}

export interface PromptCardProps extends PromptBase {
  onCopy?: () => void;
  onLike?: (promptId: number, isLiked: boolean) => void;
  onReport?: () => void;
  onPreview?: () => void;
}

export interface PromptPage {
  prompts: PromptBase[];
  totalCount: number;
}
