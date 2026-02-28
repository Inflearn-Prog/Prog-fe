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
      <p className="mb-3 body-medium text-gray-800">{label}</p>
      <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-3">
        {STATE_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option as StateType)}
            className={`
              text-center py-2.5 px-4 rounded-md body-medium shadow-md transition-all
              w-full 
              md:w-auto md:min-w-[7.5rem]
              
              ${
                value === option
                  ? "bg-frog-600 text-white shadow-sm font-semibold"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
              }
            `}
          >
            {option}
          </button>
        ))}
        {value === STATE_VALUES.OTHER && (
          <div className="col-span-full md:flex-1 mt-1 md:mt-0">
            <BaseInput
              placeholder="상태를 직접 입력해주세요"
              value={otherValue}
              onChange={(e) => onOtherChange(e.target.value)}
              viewLength={true}
              maxLength={20}
              inputSize="lg"
            />
          </div>
        )}
      </div>
    </section>
  );
};
