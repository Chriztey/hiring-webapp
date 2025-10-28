"use client";

import { Job } from "../app/data/job";
import { useState } from "react";

interface ManageJobModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (jobId: string, newStatus: string) => void;
  onDeleteJob: (jobId: string) => void;
}

export default function ManageJobModal({
  job,
  isOpen,
  onClose,
  onUpdateStatus,
  onDeleteJob,
}: ManageJobModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !job) return null;

  const handleStatusToggle = async () => {
    setLoading(true);
    const newStatus = job.status === "Active" ? "Inactive" : "Active";
    await onUpdateStatus(job.id, newStatus);
    setLoading(false);
    onClose();
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    setLoading(true);
    await onDeleteJob(job.id);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-72 text-center space-y-4">
        <p className="text-lg font-semibold">{job.title}</p>

        <button
          className={`w-full ${
            job.status === "Active"
              ? "bg-yellow-400 hover:bg-yellow-500"
              : "bg-green-500 hover:bg-green-600"
          } text-white py-2 rounded transition`}
          onClick={handleStatusToggle}
          disabled={loading}
        >
          {job.status === "Active" ? "Deactive" : "Activate"}
        </button>

        <button
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          onClick={handleDelete}
          disabled={loading}
        >
          Delete
        </button>

        <button
          className="w-full text-sm text-gray-500 mt-2 hover:underline"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
