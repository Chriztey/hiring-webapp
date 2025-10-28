"use client";
import { useState, useEffect } from "react";
import JobTypeSelect from "./jobtypeselect";
import JobSalaryInput from "./jobsalaryinput";
import ProfileRequirementsSection from "./profilerequirementsection";
import { supabase } from "@/app/lib/supabase";
import toast from "react-hot-toast";
import { Job } from "@/app/data/job";

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobToEdit?: Job | null;
  onJobUpdated?: () => void; // callback to refresh job list
}

export default function JobModal({
  isOpen,
  onClose,
  jobToEdit,
  onJobUpdated,
}: JobModalProps) {
  // Form states
  const [status, setStatus] = useState("Active");
  const [jobName, setJobName] = useState("");
  const [jobType, setJobType] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [candidateCount, setCandidateCount] = useState("");
  const [minSalary, setMinSalary] = useState<number | "">("");
  const [maxSalary, setMaxSalary] = useState<number | "">("");
  const [formFields, setFormFields] = useState<
    Record<string, "Mandatory" | "Optional" | "Off">
  >({
    fullName: "Mandatory",
    photoProfile: "Mandatory",
    gender: "Mandatory",
    domicile: "Mandatory",
    email: "Mandatory",
    phoneNumber: "Mandatory",
    linkedinLink: "Mandatory",
    dateOfBirth: "Mandatory",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  // Prefill if editing
  useEffect(() => {
    if (jobToEdit) {
      setJobName(jobToEdit.title);
      setJobType(jobToEdit.type);
      setJobDescription(jobToEdit.description);
      setCandidateCount(jobToEdit.candidateCount.toString());
      setMinSalary(jobToEdit.minSalary);
      setMaxSalary(jobToEdit.maxSalary);
      setStatus(jobToEdit.status);
      setFormFields({
        fullName: jobToEdit.formFields.fullName,
        photoProfile: jobToEdit.formFields.photoProfile,
        gender: jobToEdit.formFields.gender,
        domicile: jobToEdit.formFields.domicile,
        email: jobToEdit.formFields.email,
        phoneNumber: jobToEdit.formFields.phoneNumber,
        linkedinLink: jobToEdit.formFields.linkedinLink,
        dateOfBirth: jobToEdit.formFields.dateOfBirth,
      });
    } else {
      // Reset form for creating new
      setJobName("");
      setJobType("");
      setJobDescription("");
      setCandidateCount("");
      setMinSalary("");
      setMaxSalary("");
      setFormFields({
        fullName: "Mandatory",
        photoProfile: "Mandatory",
        gender: "Mandatory",
        domicile: "Mandatory",
        email: "Mandatory",
        phoneNumber: "Mandatory",
        linkedinLink: "Mandatory",
        dateOfBirth: "Mandatory",
      });
    }
  }, [jobToEdit, isOpen]);

  // Form validation
  useEffect(() => {
    const valid =
      jobName.trim() !== "" &&
      jobType.trim() !== "" &&
      jobDescription.trim() !== "" &&
      candidateCount.trim() !== "";
    setIsFormValid(valid);
  }, [jobName, jobType, jobDescription, candidateCount]);

  const handleSalaryChange = (min: number | string, max: number | string) => {
    setMinSalary(min as number);
    setMaxSalary(max as number);
  };

  // Submit (create or update)
  const handleSubmit = async () => {
    if (!isFormValid) return;

    const jobData = {
      title: jobName,
      candidateCount: Number(candidateCount),
      minSalary: minSalary || 0,
      maxSalary: maxSalary || 0,
      status: status,
      startDate: new Date().toISOString().split("T")[0],
      company: "Rakamin",
      location: "Jakarta, Indonesia",
      description: jobDescription,
      type: jobType,
      formFields: formFields,
    };

    try {
      if (jobToEdit) {
        // Update existing job
        const { error } = await supabase
          .from("job")
          .update(jobData)
          .eq("id", jobToEdit.id);
        if (error) throw error;

        toast.success("Job updated successfully!");
      } else {
        // Create new job
        const { error } = await supabase.from("job").insert(jobData);
        if (error) throw error;

        toast.success("Job created successfully!");
      }

      onClose();
      onJobUpdated?.(); // refresh job list
    } catch (err) {
      console.error(err);
      toast.error("Failed to save job!");
    }
  };

  // Delete job
  const handleDelete = async () => {
    if (!jobToEdit) return;
    const confirmDelete = confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from("job")
        .delete()
        .eq("id", jobToEdit.id);
      if (error) throw error;

      toast.success("Job deleted successfully!");
      onClose();
      onJobUpdated?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete job!");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-6">
          <h2 className="font-bold text-xl text-neutral-100">
            {jobToEdit ? "Edit Job" : "Job Opening"}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-90 hover:text-gray-700 text-2xl leading-none h-6 w-6"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Job Name */}
          <div className="space-y-2">
            <label className="block text-s-regular text-gray-700">
              Job Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              placeholder="Ex. Front End Engineer"
              className="w-full p-2 text-m-regular placeholder:text-neutral-60 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-main"
            />
          </div>

          {/* Job Type Select */}
          <JobTypeSelect onSelect={(type: string) => setJobType(type)} />

          <div className="space-y-2">
            <label className="block text-s-regular text-gray-700">
              Job Status<span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              {["Active", "Inactive", "Draft"].map((value) => (
                <label key={value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="status"
                    value={value}
                    checked={status === value}
                    onChange={() => setStatus(value)}
                    className="accent-primary-main"
                  />
                  <span className="text-sm">{value}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <label className="block text-s-regular text-gray-700">
              Job Description<span className="text-red-500">*</span>
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Ex. Write a short description..."
              className="w-full h-32 border rounded-md px-3 py-2 text-m-regular placeholder:text-neutral-60 focus:outline-none focus:ring-2 focus:ring-primary-main resize-none text-sm leading-relaxed align-top"
            ></textarea>
          </div>

          {/* Number of Candidates */}
          <div className="space-y-2">
            <label className="block text-s-regular text-gray-700">
              Number of Candidate Needed<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={candidateCount}
              onChange={(e) => setCandidateCount(e.target.value)}
              placeholder="Ex. 2"
              className="w-full p-2 text-m-regular placeholder:text-neutral-60 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-main"
            />
          </div>

          <div className="h-[1px] bg-neutral-300 my-4 w-full" />

          {/* Salary */}
          <JobSalaryInput
            minSalary={minSalary}
            maxSalary={maxSalary}
            onChange={handleSalaryChange}
          />

          {/* Profile Requirements */}
          <ProfileRequirementsSection
            selections={formFields}
            onChange={setFormFields}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t p-6">
          {jobToEdit && (
            <button
              onClick={handleDelete}
              className="mr-auto text-red-500 hover:text-red-700 font-bold"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`text-m-bold px-4 py-2 rounded-[8px] transition-colors ${
              isFormValid
                ? "bg-primary-main hover:bg-primary-hover text-white cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {jobToEdit ? "Update Job" : "Publish Job"}
          </button>
        </div>
      </div>
    </div>
  );
}
