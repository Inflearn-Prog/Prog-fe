export const Stepper = ({ currentStep }: { currentStep: string }) => {
  const steps = ["기본 정보", "커리어 정보", "추가 정보"];

  const getActiveIndex = () => {
    switch (currentStep) {
      case "pick-option":
        return 0;
      case "detail":
        return 1;
      case "preview":
        return 2;
      default:
        return -1;
    }
  };

  const activeIndex = getActiveIndex();

  return (
    <div className="col-span-6 pb-12 md:px-4">
      <ul className="flex gap-4 justify-center">
        {steps.map((label, index) => (
          <li
            key={label}
            className={`py-2 px-1 md:px-12 border-b-4 transition-colors md:label-medium label-small ${
              activeIndex === index
                ? "text-frog-600 border-frog-600"
                : "text-gray-400 border-gray-400"
            }`}
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
};
