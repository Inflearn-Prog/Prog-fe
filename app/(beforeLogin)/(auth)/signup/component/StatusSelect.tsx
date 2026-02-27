import { BaseInput } from "@/components/shared/inputs";

import { STATE_OPTIONS, STATE_VALUES, StateType } from "../../constant";

interface StatusSelectProps {
  label: string;
  value: StateType | "";
  otherValue: string;
  onSelect: (status: StateType) => void;
  onOtherChange: (val: string) => void;
}

export const StatusSelect = ({
  label,
  value,
  otherValue,
  onSelect,
  onOtherChange,
}: StatusSelectProps) => {
  return (
    <section>
      <p className="mb-2 body-medium">{label}</p>
      <div className="flex gap-2 flex-wrap">
        {STATE_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option as StateType)}
            className={`text-center min-w-[120px] py-2 px-4 rounded-md body-medium transition-colors ${
              value === option
                ? "bg-frog-600 text-gray-0 shadow-md"
                : "bg-gray-50 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {option}
          </button>
        ))}
        {value === STATE_VALUES.OTHER && (
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
