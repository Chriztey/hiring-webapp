"use client";

import TopBar from "../../components/topbar";
import SearchBar from "../../components/searchbar";
import EmptyState from "../../components/emptystate";
import JobModal from "../../components/jobmodal";
import JobCard from "../../components/jobcard";
import { useEffect, useState } from "react";
import { Job } from "../data/job";
import { supabase } from "../../services/supabase";
import { useRouter } from "next/navigation";

export default function JobListContent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null);

  const handleEditJob = (job: Job) => {
    setJobToEdit(job);
    setIsModalOpen(true);
  };

  const handleManageJob = (job: Job) => {
    router.push(`/managecandidates/${job.id}`);
  };

  const handleCreateJob = () => {
    setIsModalOpen(true);
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("job")
        .select("*")
        .order("startDate", { ascending: false });
      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-l-bold">
        <p className="text-neutral-80">Please wait...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-start px-5 py-4.5">
      <TopBar title="Job Board" />

      <div className="w-full flex flex-col md:flex-row item-start gap-6 pt-9">
        <div className="w-full flex-col flex justify-center mb-8 gap-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {jobs.length === 0 ? (
            <EmptyState onCreate={handleCreateJob} />
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onManage={handleManageJob}
                  onEdit={handleEditJob}
                />
              ))}
            </div>
          )}
        </div>

        <div className="relative w-full md:w-[300px] h-fit bg-[url('/hiring.jpg')] bg-cover bg-center rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-[#000000B8]"></div>
          <div className="relative z-10 flex flex-col justify-center h-full text-start text-white py-6 px-6">
            <p className="text-m-bold text-neutral-40 whitespace-nowrap">
              Recruit the best candidates
            </p>
            <p className="text-s-regular mt-1 whitespace-nowrap">
              Create jobs, invite, and hire with ease
            </p>
            <button
              onClick={handleCreateJob}
              className="mt-4 bg-primary-main text-white text-m-bold px-4 py-2 rounded-md hover:bg-primary-hover w-full"
            >
              Create a new job
            </button>
          </div>
        </div>
      </div>

      <JobModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setJobToEdit(null);
        }}
        jobToEdit={jobToEdit}
        onJobUpdated={() => fetchJobs()}
      />
    </div>
  );
}
