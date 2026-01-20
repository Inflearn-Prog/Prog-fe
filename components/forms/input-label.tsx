"use client";

import { BaseInput, BaseInputProps } from "../shared/inputs";
import { LabelWrapper } from "./ui/label-wrapper";

interface InputLabelProps extends BaseInputProps {
  label: string;
  htmlFor: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  viewLength?: boolean;
}
export function InputLabel({ label, htmlFor, ...res }: InputLabelProps) {
  return (
    <LabelWrapper htmlFor={htmlFor} label={label}>
      <BaseInput inputSize="lg" name={htmlFor} id={htmlFor} {...res} />
    </LabelWrapper>
  );
}
