import { BaseInput } from "@/components/shared/inputs";

import { STATE_OPTIONS } from "../constant";

interface StatusSelectProps {
  value: string;
  otherValue: string;
  onSelect: (status: string) => void;
  onOtherChange: (val: string) => void;
}

export const StatusSelect = ({
  value,
  otherValue,
  onSelect,
  onOtherChange,
}: StatusSelectProps) => {
  return (
    <section>
      <p className="mb-2 body-medium">현재 상태를 선택해주세요.</p>
      <div className="flex gap-2 flex-wrap">
        {STATE_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`text-center min-w-[120px] py-2 px-4 rounded-md body-medium transition-colors ${
              value === option
                ? "bg-frog-600 text-gray-0 shadow-md"
                : "bg-gray-50 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {option}
          </button>
        ))}
        {value === "기타" && (
          <div className="flex-1">
            <BaseInput
              placeholder="직접입력"
              value={otherValue}
              onChange={(e) => onOtherChange(e.target.value)}
              viewLength={true}
              maxLength={20}
            />
          </div>
        )}
      </div>
    </section>
  );
};
