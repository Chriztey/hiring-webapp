"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserRole from "@/features/auth/hooks/useUserRole";
import JobListContent from "./joblistcontent"; // move your current JobListPage JSX here

export default function JobListPageWrapper() {
  const router = useRouter();
  const { role, loading } = useUserRole();

  useEffect(() => {
    if (!loading && role !== "admin") {
      router.replace("/jobboard"); // redirect non-admins
    }
  }, [loading, role, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-l-bold">
        Loading...
      </div>
    );
  }

  if (role === "admin") {
    return <JobListContent />; // show your job list page
  }

  return null; // non-admins redirected
}
