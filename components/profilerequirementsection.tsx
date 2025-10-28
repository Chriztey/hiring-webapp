interface ProfileRequirementsSectionProps {
  selections: Record<string, "Mandatory" | "Optional" | "Off">;
  onChange: (
    newSelections: Record<string, "Mandatory" | "Optional" | "Off">
  ) => void;
}

export default function ProfileRequirementsSection({
  selections,
  onChange,
}: ProfileRequirementsSectionProps) {
  const fields = [
    "fullName",
    "photoProfile",
    "gender",
    "domicile",
    "email",
    "phoneNumber",
    "linkedinLink",
    "dateOfBirth",
  ];

  // ✅ Helper: convert camelCase or mixed case to "Title Case"
  const formatFieldName = (field: string) =>
    field
      .replace(/([A-Z])/g, " $1") // insert space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // capitalize first letter

  const lockedFields = ["fullName", "photoProfile", "email"];

  const handleSelect = (
    field: string,
    value: "Mandatory" | "Optional" | "Off"
  ) => {
    if (lockedFields.includes(field)) return;
    onChange({ ...selections, [field]: value });
  };

  return (
    <div className="mt-6 w-full border border-gray-200 rounded-lg p-4 bg-white">
      <p className="text-m-bold text-neutral-90 mb-4">
        Minimum Profile Information Required
      </p>

      <div className="space-y-2 text-m-regular text-neutral-90">
        {fields.map((field) => {
          const isLocked = lockedFields.includes(field);

          return (
            <div
              key={field}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b last:border-b-0 py-2"
            >
              <span className="text-m-regular text-neutral-90">
                {formatFieldName(field)}
              </span>
              <div className="flex items-center text-m-regular text-neutral-90 gap-2 mt-2 sm:mt-0">
                {["Mandatory", "Optional", "Off"].map((option) => {
                  const isSelected = selections[field] === option;

                  let classes = `px-3 py-1 text-xs rounded-full border transition-all`;

                  if (isLocked) {
                    if (option === "Mandatory") {
                      classes +=
                        " border-primary-main text-primary-main bg-white cursor-not-allowed";
                    } else {
                      classes +=
                        " border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed";
                    }
                  } else {
                    if (isSelected) {
                      classes +=
                        option === "Off"
                          ? " bg-gray-300 text-gray-600 border-gray-300"
                          : " bg-white text-primary-main border-primary-main";
                    } else {
                      classes +=
                        " border-gray-300 text-gray-600 bg-white hover:bg-gray-100";
                    }
                  }

                  return (
                    <button
                      key={option}
                      onClick={() =>
                        handleSelect(
                          field,
                          option as "Mandatory" | "Optional" | "Off"
                        )
                      }
                      disabled={isLocked}
                      className={classes}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
