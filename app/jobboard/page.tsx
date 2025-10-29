"use client";

import { useEffect, useState } from "react";
import { Job } from "../data/job";
import UserJobList from "@/components/userjoblist";
import JobDetail from "@/components/jobdetail";
import EmptyStateJob from "@/components/emptystatejob";
import TopBar from "@/components/topbar";
import { supabase } from "../../services/supabase";
import { auth } from "@/services/firebase";
import { onAuthStateChanged } from "@firebase/auth";

export default function JobBoardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);

  // useEffect(() => {
  //   async function fetchJobs() {
  //     setLoading(true);
  //     try {
  //       const { data, error } = await supabase
  //         .from("job")
  //         .select("*")
  //         .eq("status", "Active")
  //         .order("startDate", { ascending: false }); // latest first

  //       if (error) {
  //         throw error;
  //       }

  //       setJobs(data || []);
  //     } catch (err) {
  //       console.error("Failed to fetch jobs", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchJobs();
  // }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.error("User not logged in");
        setLoading(false);
        return;
      }

      const userUid = user.uid;
      setLoading(true);

      try {
        // 1️⃣ Fetch active jobs
        const { data: jobsData, error: jobsError } = await supabase
          .from("job")
          .select("*")
          .eq("status", "Active")
          .order("startDate", { ascending: false });

        if (jobsError) throw jobsError;

        // 2️⃣ Fetch applied jobs
        const { data: appliedData, error: appliedError } = await supabase
          .from("resume_submissions")
          .select("job_id")
          .eq("uid", userUid);

        if (appliedError) throw appliedError;

        const appliedJobIds = (appliedData || []).map((item) => item.job_id);
        setAppliedJobIds(appliedJobIds);

        // 3️⃣ Merge applied info into jobs
        const jobsWithAppliedStatus = (jobsData || []).map((job) => ({
          ...job,
          isApplied: appliedJobIds.includes(job.id),
        }));

        setJobs(jobsWithAppliedStatus);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe(); // cleanup on unmount
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-l-bold">
        <p className="text-neutral-80">Please wait...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-start px-5 py-4.5">
      <TopBar title="Job Board" />

      {jobs.length === 0 ? (
        <EmptyStateJob />
      ) : (
        <div className="flex flex-col md:flex-row w-full h-screen p-4 md:p-8">
          {/* Left side - Job List (hidden on small screens) */}
          <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r bg-white overflow-y-auto h-64 md:h-auto hidden md:block">
            <UserJobList
              jobs={jobs}
              selectedJob={selectedJob}
              onSelect={setSelectedJob}
              appliedJobIds={appliedJobIds} // ✅ pass applied IDs
            />
          </div>

          {/* Right side - Job Detail */}
          <div className="flex-1 bg-white overflow-y-auto mt-4 md:mt-0 ">
            {/* Small screens: show all job details stacked vertically */}
            <div className="block md:hidden space-y-4 ">
              {jobs.map((job) => (
                <JobDetail
                  key={job.id}
                  job={job}
                  isApplied={appliedJobIds.includes(job.id)}
                />
              ))}
            </div>

            {/* Medium+ screens: show selected job */}
            <div className="hidden md:block">
              <JobDetail
                isApplied={
                  selectedJob ? appliedJobIds.includes(selectedJob.id) : false
                }
                job={selectedJob}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
