"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface JobTypeSelectProps {
  onSelect?: (type: string) => void;
}

export default function JobTypeSelect({ onSelect }: JobTypeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);

  const jobTypes = [
    { label: "Full Time", disabled: false },
    { label: "Contract", disabled: false },
    { label: "Part Time", disabled: false },
    { label: "Internship", disabled: false },
    { label: "Freelance", disabled: false },
  ];

  const handleSelect = (type: string, disabled: boolean) => {
    if (disabled) return;
    setSelected(type);
    onSelect?.(type); // send selected type back to parent
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative space-y-2" ref={ref}>
      <label className="block text-s-regular text-gray-700">
        Job Type<span className="text-red-500">*</span>
      </label>

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        className="w-full flex justify-between items-center border rounded-md px-3 py-2 text-m-regular text-neutral-60 bg-white focus:outline-none focus:ring-2 focus:ring-primary-main"
      >
        {selected || "Select job type"}
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
          {jobTypes.map(({ label, disabled }) => (
            <button
              key={label}
              type="button"
              onClick={() => handleSelect(label, disabled)}
              disabled={disabled}
              className={`block w-full text-left px-4 py-2 text-s-bold transition-colors
                ${
                  disabled
                    ? "text-gray-400 cursor-not-allowed bg-gray-50"
                    : selected === label
                    ? "bg-primary-light/30 text-primary-main"
                    : "text-neutral-100 hover:bg-primary-light"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
