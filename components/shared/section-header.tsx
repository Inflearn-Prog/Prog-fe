import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

const STYLES = {
  TITLE: "text-2xl font-bold mb-4 text-center",
  SUBTITLE: "mb-6 text-center text-sm text-gray-600",
} as const;

export function SectionHeader({
  title,
  subtitle,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <h2 className={STYLES.TITLE}>{title}</h2>
      <p className={STYLES.SUBTITLE}>{subtitle}</p>
    </div>
  );
}
