"use client";

import { useRouter } from "next/navigation";

export const dynamic = "force-static";

export default function EmptyStateJob() {
  const router = useRouter();

  const handleBack = () => {
    router.replace("/jobboard"); // replaces history entry
  };

  return (
    <div className="flex flex-col items-center justify-center text-center w-full h-screen overflow-hidden">
      <img
        src="/success.svg"
        alt="Application Sent illustration"
        className="w-64 h-64 object-contain"
      />
      <div className="space-y-1 mt-4">
        <p className="heading-m-bold text-neutral-90">
          🎉 Your application was sent!
        </p>
        <p className="text-l-regular text-neutral-90">
          Congratulations! You've taken the first step towards a rewarding
          career at Rakamin. <br />
          We look forward to learning more about you during the application
          process.
        </p>
      </div>

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="mt-6 px-6 py-3 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition"
      >
        Back to Job Board
      </button>
    </div>
  );
}
