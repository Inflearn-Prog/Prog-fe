import { Label } from "@/components/ui/label";

export function LabelWrapper({
  children,
  label,
  htmlFor,
  onClick = () => {},
}: {
  children: React.ReactNode;
  label: string;
  htmlFor: string;
  onClick?: () => void;
}) {
  return (
    <div className="flex flex-col gap-y-3">
      <Label
        className="text-black body-large cursor-pointer"
        htmlFor={htmlFor}
        onClick={onClick}
      >
        {label}
      </Label>
      {children}
    </div>
  );
}
