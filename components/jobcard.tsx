import { Job } from "../app/data/job";

interface JobCardProps {
  job: Job;
  onManage: (job: Job) => void;
  onEdit?: (job: Job) => void; // optional edit callback
}

export default function JobCard({ job, onManage, onEdit }: JobCardProps) {
  const formatCurrency = (num: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const getStatusStyle = (status: Job["status"]) => {
    switch (status) {
      case "Active":
        return "bg-success-surface text-success-main border-success-border";
      case "Inactive":
        return "bg-danger-surface text-danger-main border-danger-border";
      case "Draft":
        return "bg-secondary-surface text-secondary-main border-secondary-border";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between  border border-neutral-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
      {/* Left Side */}
      <div className="flex flex-col justify-start gap-3 ">
        <div className="flex items-center gap-3">
          <span
            className={`px-4 py-1 text-m-bold rounded-[8px] border ${getStatusStyle(
              job.status
            )}`}
          >
            {job.status}
          </span>
          <span className="px-4 py-1 text-m-regular rounded-lg border-neutral-40 border">
            started on {formatDate(job.startDate)}
          </span>
        </div>

        <div className="gap-2">
          <h3 className="font-bold text-xl text-neutral-100 ">{job.title}</h3>
          <p className="text-neutral-80 text-l-regular">
            {formatCurrency(job.minSalary)} - {formatCurrency(job.maxSalary)}
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex  md:flex-row justify-end items-end gap-4">
        {onEdit && (
          <button
            onClick={() => onEdit(job)}
            className="bg-secondary-main text-black text-s-bold px-4 py-1 rounded-[8px] hover:bg-secondary-hover transition"
          >
            Edit
          </button>
        )}

        <button
          className="bg-primary-main text-white text-s-bold px-4 py-1 rounded-[8px] hover:bg-primary-hover transition"
          onClick={() => onManage(job)}
        >
          Manage Job
        </button>
      </div>
    </div>
  );
}
