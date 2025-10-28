"use client";

import { useEffect, useState } from "react";
import { Job } from "../data/job";
import UserJobList from "@/components/userjoblist";
import JobDetail from "@/components/jobdetail";
import EmptyStateJob from "@/components/emptystatejob";
import TopBar from "@/components/topbar";
import { supabase } from "../lib/supabase";

export default function JobBoardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("job")
          .select("*")
          .eq("status", "Active")
          .order("startDate", { ascending: false }); // latest first

        if (error) {
          throw error;
        }

        setJobs(data || []);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-l-bold">
        <p className="text-neutral-80">Please wait...</p>
      </div>
    );
  }

  return (
    // <div className="min-h-screen w-full bg-white flex flex-col items-start px-5 py-4.5">
    //   <TopBar title="Job Board" />

    //   {jobs.length === 0 ? (
    //     <EmptyStateJob />
    //   ) : (
    //     <div className="flex flex-col md:flex-row w-full h-screen p-4 md:p-8">
    //       {/* Left side */}
    //       <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r bg-white overflow-y-auto h-64 md:h-auto">
    //         <UserJobList
    //           jobs={jobs}
    //           selectedJob={selectedJob}
    //           onSelect={setSelectedJob}
    //         />
    //       </div>

    //       {/* Right side */}
    //       <div className="flex-1 bg-white overflow-y-auto mt-4 md:mt-0">
    //         <JobDetail job={selectedJob} />
    //       </div>
    //     </div>
    //   )}
    // </div>

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
            />
          </div>

          {/* Right side - Job Detail */}
          <div className="flex-1 bg-white overflow-y-auto mt-4 md:mt-0 ">
            {/* Small screens: show all job details stacked vertically */}
            <div className="block md:hidden space-y-4 ">
              {jobs.map((job) => (
                <JobDetail key={job.id} job={job} />
              ))}
            </div>

            {/* Medium+ screens: show selected job */}
            <div className="hidden md:block">
              <JobDetail job={selectedJob} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
