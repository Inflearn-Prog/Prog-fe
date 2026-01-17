"use client";

import { useRef } from "react";

import { SelectBox, SelectBoxProps } from "../shared/select-box";
import { LabelWrapper } from "./ui/label-wrapper";

interface SelectLabelProps extends SelectBoxProps {
  label: string;
  htmlFor: string;
}
export function SelectLabel({ label, htmlFor, ...res }: SelectLabelProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleLabelClick = () => {
    try {
      if (triggerRef.current) {
        triggerRef.current.click();
      }
    } catch (error) {
      console.error("셀렉트 박스 열기 중 오류 발생:", error);
    }
  };

  return (
    <LabelWrapper htmlFor={htmlFor} label={label} onClick={handleLabelClick}>
      <SelectBox {...res} triggerRef={triggerRef} />
    </LabelWrapper>
  );
}
