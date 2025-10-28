import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="flex items-center w-full border border-[#EDEDED] rounded-md px-3 py-2 focus-outline-primary-main">
      <input
        type="text"
        placeholder="Search by job details"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="grow outline-none text-sm text-gray-700 placeholder-gray-400"
      />
      <Search className="w-5 h-5 text-primary-main" />
    </div>
  );
}
