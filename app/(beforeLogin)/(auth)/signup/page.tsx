import { cn } from "@/lib/utils";

import Complete from "./component/Complete";
import Detail from "./component/Detail";
import PickOption from "./component/PickOption";
import Preview from "./component/Preview";
import Select from "./component/Select";

const VALID_STEPS = [
  "select",
  "pick-option",
  "detail",
  "preview",
  "complete",
] as const;
type SignupStep = (typeof VALID_STEPS)[number];

function getStepStyle(step: SignupStep): string {
  switch (step) {
    case "select":
      return "col-span-4 md:col-start-2 md:col-span-2 lg:col-start-4 lg:col-span-6";
    case "pick-option":
    case "detail":
    case "preview":
    case "complete":
      return "col-span-4 md:col-span-4 lg:col-start-3 lg:col-span-8";
    default:
      return "col-span-4 md:col-start-2 md:col-span-2 lg:col-start-4 lg:col-span-6";
  }
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) {
  const { step } = await searchParams;
  const isStepValid = (s: string | undefined): s is SignupStep =>
    VALID_STEPS.includes(s as SignupStep);

  const currentStep: SignupStep = isStepValid(step) ? step : "select";

  const activeStyle = getStepStyle(currentStep);

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10" />
      <div
        className={cn(
          "z-20 bg-white rounded-xl p-8 shadow-2xl transition-all duration-300",
          activeStyle
        )}
      >
        {currentStep === "select" && <Select />}
        {currentStep === "pick-option" && <PickOption />}
        {currentStep === "detail" && <Detail />}
        {currentStep === "preview" && <Preview />}
        {currentStep === "complete" && <Complete />}
      </div>
    </>
  );
}

/**
 * search params
 * @step
 * select
 * pick-option
 * detail
 * preview
 * complete
 */
