import { Job } from "@/app/data/job";
import UserJobCard from "@/components/userjobcard";
interface JobListProps {
  jobs: Job[];
  selectedJob: Job | null;
  onSelect: (job: Job) => void;
  appliedJobIds: string[];
}

export default function UserJobList({
  jobs,
  selectedJob,
  onSelect,
  appliedJobIds,
}: JobListProps) {
  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      {jobs.map((job) => (
        <UserJobCard
          key={job.id}
          job={job}
          isSelected={selectedJob?.id === job.id}
          onSelect={onSelect}
          isApplied={appliedJobIds.includes(job.id)}
        />
      ))}
    </div>
  );
}
