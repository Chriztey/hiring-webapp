"use client";

export default function EmptyStateCandidate() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-screen overflow-hidden">
      <img
        src="/empty_state_cand.svg"
        alt="No Candidates illustration"
        className="w-64 h-64 object-contain"
      />
      <div className="space-y-1 mt-4">
        <p className="text-l-bold text-black">No candidates found</p>
        <p className="text-m-regular text-neutral-70">
          Share your job vacancies so that more candidates will apply.
        </p>
      </div>
    </div>
  );
}
