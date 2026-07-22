import { cn } from "@/lib/utils";

export type StoryBoxTheme = "default" | "blue" | "green" | "purple" | "orange";

const THEME_COLORS = new Map<StoryBoxTheme, string>([
  ["default", "bg-[lightgray]"],
  ["blue", "bg-[#e0f2fe]"],
  ["green", "bg-[#dcfce7]"],
  ["purple", "bg-[#f3e8ff]"],
  ["orange", "bg-[#ffedd5]"],
]);

interface StoryBoxProps {
  children: React.ReactNode;
  theme?: StoryBoxTheme;
}
export function StoryBox({ children, theme = "default" }: StoryBoxProps) {
  return (
    <div
      className={cn(
        "w-full p-10",
        THEME_COLORS.get(theme) || THEME_COLORS.get("default"), // ✅ Map의 get 메서드 사용
        "bg-[conic-gradient(#fff_90deg,#0000_90deg_180deg,#fff_180deg_270deg,#0000_270deg)]",
        "bg-size-[100px_100px]"
      )}
    >
      {children}
    </div>
  );
}
