import { useState } from "react";

interface JobSalaryInputProps {
  minSalary: number | string;
  maxSalary: number | string;
  onChange: (min: number | string, max: number | string) => void;
}

export default function JobSalaryInput({
  minSalary,
  maxSalary,
  onChange,
}: JobSalaryInputProps) {
  const [error, setError] = useState("");

  // Format number to Indonesian style: 8000 -> 8.000
  const formatNumber = (value: number | string) => {
    if (value === "" || value === null) return "";
    return Number(value).toLocaleString("id-ID");
  };

  const handleMinChange = (value: string) => {
    const newMin = value === "" ? "" : Number(value);
    onChange(newMin, maxSalary);

    // Validate
    if (
      typeof maxSalary === "number" &&
      typeof newMin === "number" &&
      newMin > maxSalary
    ) {
      setError("Maximum salary cannot be lower than minimum salary");
    } else {
      setError("");
    }
  };

  const handleMaxChange = (value: string) => {
    const newMax = value === "" ? "" : Number(value);
    onChange(minSalary, newMax);

    // Validate
    if (
      typeof minSalary === "number" &&
      typeof newMax === "number" &&
      newMax < minSalary
    ) {
      setError("Maximum salary cannot be lower than minimum salary");
    } else {
      setError("");
    }
  };

  return (
    <div className="mt-2 flex flex-col gap-3 w-full">
      <label className="text-neutral-90 text-s-regular">Job Salary</label>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 w-full ">
        {/* Minimum Salary */}
        <div className="flex-1">
          <label className="text-neutral-90 text-s-regular mb-2 block">
            Minimum Estimated Salary
          </label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-primary-main">
            <span className="text-neutral-500 text-m-bold mr-2">Rp</span>
            <input
              type="text"
              value={formatNumber(minSalary)}
              onChange={(e) =>
                handleMinChange(e.target.value.replace(/\./g, ""))
              }
              placeholder="7.000.000"
              className="w-full focus:outline-none text-neutral-700 placeholder-neutral-400"
            />
          </div>
        </div>

        <div className="hidden sm:block text-neutral-40 text-lg font-semibold justify-center items-center pt-[24px]">
          –
        </div>

        {/* Maximum Salary */}
        <div className="flex-1">
          <label className="text-neutral-90 text-s-regular mb-2 block">
            Maximum Estimated Salary
          </label>
          <div className="flex flex-col">
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-primary-main">
              <span className="text-neutral-500 text-m-bold mr-2">Rp</span>
              <input
                type="text"
                value={formatNumber(maxSalary)}
                onChange={(e) =>
                  handleMaxChange(e.target.value.replace(/\./g, ""))
                }
                placeholder="8.000.000"
                className="w-full focus:outline-none text-neutral-700 placeholder-neutral-60"
              />
            </div>
          </div>
        </div>
      </div>
      {error && <p className="text-danger-main text-sm mt-1">{error}</p>}
    </div>
  );
}
