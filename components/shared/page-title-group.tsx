import { cn } from "@/lib/utils";

interface PageTitleGroupProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const STYLES = {
  TITLE: "heading-large font-bold mb-2",
  SUBTITLE: "body-medium",
} as const;

export function PageTitleGroup({
  title,
  subtitle,
  className,
}: PageTitleGroupProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <h1 className={STYLES.TITLE}>{title}</h1>
      {subtitle && <p className={STYLES.SUBTITLE}>{subtitle}</p>}
    </div>
  );
}
