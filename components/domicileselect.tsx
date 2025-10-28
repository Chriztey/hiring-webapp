"use client";
import { provinces } from "@/app/data/provinces";

type DomicileSelectProps = {
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string; // show red border + helper text when present
  required?: boolean; // pass from parent if field is Mandatory
  name?: string; // (optional) so form libraries can reference it
  placeholder?: string; // custom first option text
};

export default function DomicileSelect({
  value,
  onChange,
  onBlur,
  error,
  required,
  name = "domicile",
  placeholder = "Choose your domicile",
}: DomicileSelectProps) {
  const border = error
    ? "border-danger-main focus:border-danger-main"
    : "border-neutral-60 focus:border-primary-border";

  return (
    <div className="relative overflow-visible text-s-bold">
      <select
        name={name}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={`${name}-help`}
        className={`w-full border-2 rounded-sm py-2 px-3 outline-none ${border}`}
      >
        <option value="">{placeholder}</option>
        {provinces.map((prov) => (
          <option key={prov.id} value={prov.name}>
            {prov.name}
          </option>
        ))}
      </select>

      {error && (
        <p id={`${name}-help`} className="mt-1 text-s-regular text-danger-main">
          {error}
        </p>
      )}
    </div>
  );
}
