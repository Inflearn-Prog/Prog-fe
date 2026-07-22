import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  className?: string;
}

const STYLES = {
  TITLE: "text-24 md:text-36 font-bold! mb-3 text-center",
  SUBTITLE: "text-15 text-center md:text-17",
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
