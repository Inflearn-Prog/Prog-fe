import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const STYLES = {
  TITLE: "display-small font-bold mb-3 text-center",
  SUBTITLE: "text-center body-medium",
} as const;

export function SectionHeader({
  title,
  subtitle,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <h2 className={STYLES.TITLE}>{title}</h2>
      {subtitle && <p className={STYLES.SUBTITLE}>{subtitle}</p>}
    </div>
  );
}
