import { RadioGroup } from "@radix-ui/react-radio-group";

import { REASON_TYPE } from "@/app/types/type";

import { BaseButton } from "../shared/button";
import { BaseInput } from "../shared/inputs";
import { BaseRadioItem } from "../shared/radioitem";

interface ReportModalProps {
  title: string;
  reason: string | "";
  reasonDetail: string;
  onSelect: (val: string) => void;
  onOtherChange: (val: string) => void;
  onCancel: () => void;
  onReport: () => void;
}

export default function ReportModal({
  title,
  reason,
  reasonDetail,
  onSelect,
  onOtherChange,
  onCancel,
  onReport,
}: ReportModalProps) {
  const reportIsDisabled =
    !reason || (reason === "OTHER" && !reasonDetail.trim());
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center items-center heading-small">
        {title}
      </div>
      <div className="flex flex-col">
        <RadioGroup value={reason} onValueChange={onSelect}>
          {REASON_TYPE.map((r) => (
            <BaseRadioItem label={r.label} id={r.value} value={r.value} />
          ))}
        </RadioGroup>
        <div className="flex-1 min-h-[48px]">
          {reason === "OTHER" && (
            <BaseInput
              placeholder="직접입력"
              value={reasonDetail}
              onChange={(e) => onOtherChange(e.target.value)}
              viewLength={true}
              maxLength={200}
            />
          )}
        </div>
      </div>
      <div className="flex gap-2 w-full">
        <div className="flex-1">
          <BaseButton full={true} variant="secondary" onClick={onCancel}>
            취소하기
          </BaseButton>
        </div>
        <div className="flex-1">
          <BaseButton
            full={true}
            onClick={onReport}
            disabled={reportIsDisabled}
          >
            신고하기
          </BaseButton>
        </div>
      </div>
    </div>
  );
}
