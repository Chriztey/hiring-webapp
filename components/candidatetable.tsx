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

export default function CandidateTable({
  candidates,
}: {
  candidates: Candidate[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-3">
        <thead>
          <tr className="bg-neutral-20 text-left text-s-bold text-neutral-100">
            <th className="px-4 py-3">
              <input
                type="checkbox"
                className="w-[20px] h-[20px] border border-primary-border accent-primary-main"
              />
            </th>
            <th className="px-4 py-2">NAMA LENGKAP</th>
            <th className="px-4 py-2">EMAIL ADDRESS</th>
            <th className="px-4 py-2">PHONE NUMBER</th>
            <th className="px-4 py-2">DATE OF BIRTH</th>
            <th className="px-4 py-2">DOMICILE</th>
            <th className="px-4 py-2">GENDER</th>
            <th className="px-4 py-2">LINK LINKEDIN</th>
          </tr>
        </thead>

        <tbody>
          {candidates.map((c) => (
            <tr
              key={c.id}
              className="border-t border-neutral-30 text-m-regular text-neutral-90 hover:bg-neutral-10 transition-colors"
            >
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  className="w-[20px] h-[20px] accent-primary-main border-primary-border border-8"
                />
              </td>

              <td className="px-4 py-2">{c.fullName || "-"}</td>
              <td className="px-4 py-2 max-w-[200px] truncate">
                {c.email || "-"}
              </td>
              <td className="px-4 py-2">{c.phoneNumber || "-"}</td>
              <td className="px-4 py-2">
                {c.dateOfBirth ? formatDate(c.dateOfBirth) : "-"}
              </td>
              <td className="px-4 py-2">{c.domicile || "-"}</td>
              <td className="px-4 py-2">{c.gender || "-"}</td>

              <td className="px-4 py-2 max-w-[200px] truncate">
                {c.linkedinLink ? (
                  <a
                    href={c.linkedinLink}
                    className="text-primary-main hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {c.linkedinLink}
                  </a>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// helper to format date in DD MMM YYYY
function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
