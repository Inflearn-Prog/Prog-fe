"use client";

import { SelectBox, SelectBoxProps } from "../shared/select-box";
import { LabelWrapper } from "./ui/label-wrapper";

interface SelectLabelProps extends SelectBoxProps {
  label: string;
  htmlFor: string;
}
export function SelectLabel({ label, htmlFor, ...res }: SelectLabelProps) {
  return (
    <LabelWrapper htmlFor={htmlFor} label={label}>
      <SelectBox {...res} id={htmlFor} />
    </LabelWrapper>
  );
}
