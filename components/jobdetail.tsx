import { Job } from "@/app/data/job";

import { useRouter } from "next/navigation";

interface JobDetailProps {
  job: Job | null;
  isApplied?: boolean;
}

export default function JobDetail({ job, isApplied = false }: JobDetailProps) {
  const router = useRouter();

  const handleApply = () => {
    console.log("Applying for job:", job?.id);
    if (job?.id) router.push(`/apply/${job.id}`);
  };

  if (!job) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-60 text-m-bold py-20">
        Select a job to view details.
      </div>
    );
  }

  return (
    <div className="p-4 h-full">
      <div className=" border rounded-xl p-6 bg-white shadow-md h-full">
        <div className="flex justify-between items-start mb-4 border-b border-neutral-50">
          <div className="flex items-top gap-6 mb-6 ">
            <div className="w-12 h-12 border border-neutral-4 rounded-lg flex items-center justify-center text-primary-main font-bold text-lg">
              <img src="/raka.svg" alt="raka" />
            </div>
            <div>
              <span className="px-2 py-0.5 bg-success-main text-white rounded-lg text-s-bold">
                {job.type}
              </span>
              <h3 className="text-l-bold text-neutral-90">{job.title}</h3>
              <p className="text-neutral-90 text-m-regular">{job.company}</p>
            </div>
          </div>

          {/* <button
            onClick={handleApply}
            className="bg-secondary-main text-neutral-90 text-m-bold px-4 py-1 rounded-xl hover:bg-secondary-hover transition"
          >
            Apply
          </button> */}
          <button
            onClick={handleApply}
            disabled={isApplied}
            className={`${
              isApplied
                ? "bg-neutral-30 text-neutral-60 cursor-not-allowed"
                : "bg-secondary-main text-neutral-90 hover:bg-secondary-hover"
            } text-m-bold px-4 py-1 rounded-xl transition`}
          >
            {isApplied ? "Applied" : "Apply"}
          </button>
        </div>

        <ul className="list-disc list-inside space-y-2 text-neutral-90 text-m-regular">
          {job.description}
        </ul>
      </div>
    </div>
  );
}
