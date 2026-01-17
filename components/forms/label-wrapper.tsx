import { Label } from "../ui/label";

export function LabelWrapper({
  children,
  label,
  htmlFor,
}: {
  children: React.ReactNode;
  label: string;
  htmlFor: string;
}) {
  return (
    <div className="flex flex-col gap-y-3">
      <Label className="text-black body-large" htmlFor={htmlFor}>
        {label}
      </Label>
      {children}
    </div>
  );
}
