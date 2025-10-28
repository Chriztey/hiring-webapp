// components/JobCard.tsx
import { Job } from "@/app/data/job";
import { formatCurrency } from "@/app/utils/format";

interface JobCardProps {
  job: Job;
  isSelected: boolean;
  onSelect: (job: Job) => void;
}

export default function UserJobCard({
  job,
  isSelected,
  onSelect,
}: JobCardProps) {
  return (
    <div
      onClick={() => onSelect(job)}
      className={`border rounded-xl p-4 cursor-pointer transition-all ${
        isSelected
          ? "border-2 border-primary-main shadow-md bg-primary-surface"
          : "border-neutral-40 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 border border-neutral-4 rounded-lg flex items-center justify-center text-primary-main font-bold text-lg">
          <img src="/raka.svg/" alt="rakamin" />
        </div>
        <div>
          <h3 className="text-l-bold text-neutral-90">{job.title}</h3>
          <p className="text-neutral-90 text-m-regular">{job.company}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-neutral-80 text-s-regular">
        <i className="ri-map-pin-line"></i>
        {job.location}
      </div>

      <div className="flex items-center gap-2 text-neutral-80 text-s-regular mt-2">
        <i className="ri-cash-line"></i>
        {formatCurrency(job.minSalary)} - {formatCurrency(job.maxSalary)}
      </div>
    </div>
  );
}
