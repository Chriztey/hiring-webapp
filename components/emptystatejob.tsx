"use client";

export default function EmptyStateJob() {
  return (
    <div className="flex flex-col items-center justify-center text-center w-full h-screen overflow-hidden">
      <img
        src="/empty_state_job.svg"
        alt="No Candidates illustration"
        className="w-64 h-64 object-contain"
      />
      <div className="space-y-1 mt-4">
        <p className="heading-s-bold text-neutral-90">
          No job openings available
        </p>
        <p className="text-l-regular text-neutral-90">
          Please wait for the next batch of openings.
        </p>
      </div>
    </div>
  );
}
