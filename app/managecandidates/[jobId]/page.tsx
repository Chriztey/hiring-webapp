"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CandidateTable from "@/components/candidatetable";
import EmptyStateCandidate from "@/components/emptycandidate";
import { supabase } from "@/app/lib/supabase";

interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  domicile: string;
  gender: string;
  linkedinLink: string;
}

export default function ManageCandidatesPage() {
  const { jobId } = useParams(); // ✅ read from route param
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      if (!jobId) return;
      setIsLoading(true);

      try {
        // fetch candidates related to this job
        const { data: submissions, error } = await supabase
          .from("resume_submissions")
          .select("*")
          .eq("job_id", jobId);

        if (error) throw error;

        setCandidates(submissions || []);

        // Optionally fetch job title
        const { data: jobData, error: jobError } = await supabase
          .from("job")
          .select("title")
          .eq("id", jobId)
          .single();

        if (!jobError && jobData) {
          setJobTitle(jobData.title);
        }
      } catch (err) {
        console.error("Error fetching candidates:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [jobId]);

  const handleBack = () => {
    router.push("/joblist"); // navigate back
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={handleBack}
            className="text-black text-m-bold bg-neutral-10 border border-neutral-40 rounded-[8px] px-4 py-1 shadow-sm"
          >
            Job list
          </button>
          <span className="text-neutral-100 text-2xl">›</span>
          <button className="text-black text-m-bold bg-neutral-30 border border-neutral-50 rounded-[8px] px-4 py-1 shadow-sm">
            Manage Candidate
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-main text-white rounded-full flex items-center justify-center text-sm font-semibold">
            A
          </div>
        </div>
      </div>

      <hr className="h-px bg-neutral-300 w-full"></hr>

      <h2 className="text-xl font-bold text-neutral-100">
        {jobTitle || "Job Details"}
      </h2>

      <div className="bg-white rounded-xl shadow-sm p-6">
        {isLoading ? (
          <p className="text-neutral-60">Loading candidates...</p>
        ) : candidates.length === 0 ? (
          <EmptyStateCandidate />
        ) : (
          <CandidateTable candidates={candidates} />
        )}
      </div>
    </div>
  );
}
