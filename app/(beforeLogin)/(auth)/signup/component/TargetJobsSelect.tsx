import { JOB_OPTIONS, JobType } from "../../constant";

interface TargetJobsSelectProps {
  label: string;
  selectedJobs: JobType[];
  onToggle: (job: JobType) => void;
}

export const TargetJobsSelect = ({
  label,
  selectedJobs,
  onToggle,
}: TargetJobsSelectProps) => {
  return (
    <section>
      <p className="mb-3 body-medium text-gray-800">{label}</p>
      <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-3">
        {JOB_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={`
              text-center py-2.5 px-4 rounded-md body-medium shadow-md transition-all
              w-full 
              md:w-auto md:min-w-[6.25rem] 
              
              ${
                selectedJobs.includes(option)
                  ? "bg-frog-600 text-white shadow-sm font-semibold"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
              }
            `}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
};
