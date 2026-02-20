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
      <p className="mb-2 body-medium">{label}</p>
      <div className="flex gap-2 flex-wrap">
        {JOB_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={`text-center min-w-[100px] py-2 px-4 rounded-md body-medium transition-colors ${
              selectedJobs.includes(option)
                ? "bg-frog-600 text-gray-0 shadow-md"
                : "bg-gray-50 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
};
