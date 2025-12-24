export const Stepper = ({ currentStep }: { currentStep: number }) => {
  const steps = ["기본 정보", "커리어 정보", "추가 정보"];
  const activeIdx = currentStep - 2; 

  return (
    <div className="pb-4 px-4">
      <ul className="flex gap-20 justify-center">
        {steps.map((label, idx) => {
          const isActive = idx === activeIdx;
          
          return (
            <li 
              key={label}
              className={`py-3 px-12 border-b-4 transition-all duration-300 navigation-medium font-bold ${
                isActive 
                  ? "text-frog-600 border-frog-600" 
                  : "text-gray-400 border-gray-100"
              }`}
            >
              {label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};