"use client";

export default function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center text-center mt-12 space-y-4">
      <img
        src="/empty_state.svg"
        alt="No jobs illustration"
        className="w-64 h-64 object-contain"
      />
      <div className="space-y-1">
        <p className="heading-s-bold  text-neutral-90">
          No job openings available
        </p>
        <p className="text-l-regular text-neutral-90">
          Create a job opening now and start the candidate process.
        </p>
      </div>

      <button
        onClick={onCreate}
        className="mt-3 bg-yellow-400 hover:bg-yellow-500 text-gray-800 text-l-bold px-4 py-2 rounded-[8px]"
      >
        Create a new job
      </button>
    </div>
  );
}
