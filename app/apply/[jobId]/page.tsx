"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ResumeForm from "@/components/resumeform";
import { Job } from "@/app/data/job";
import { supabase } from "@/services/supabase";

export default function ApplyPage() {
  const params = useParams();
  const jobId = params?.jobId as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("job")
          .select("*")
          .eq("id", jobId)
          .single();

        if (error) throw error;

        setJob(data as Job);
      } catch (err) {
        console.error("Error fetching job:", err);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-neutral-70">
        Loading job details...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="h-screen flex items-center justify-center text-neutral-70">
        Job not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <ResumeForm job={job} />
    </div>
  );
}
