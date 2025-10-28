// "use client";
// import { useEffect, useState } from "react";
// import CandidateTable from "@/components/candidatetable";
// import EmptyStateCandidate from "@/components/emptycandidate";

// interface Candidate {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   dob: string;
//   domicile: string;
//   gender: string;
//   linkedin: string;
// }

// export default function ManageCandidatesPage() {
//   const [candidates, setCandidates] = useState<Candidate[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const mockCandidates: Candidate[] = [];

//   const mockCadndidates = [
//     {
//       id: "1",
//       name: "Aurelie Yukiko",
//       email: "aurelieyukikodssdsdsdsdsdsdsdssssdsd@yahoo.com",
//       phone: "082120908766",
//       dob: "30 January 2001",
//       domicile: "Jakarta",
//       gender: "Female",
//       linkedin: "https://www.linkedin.com/in/user1hjhjhjhjhjhjhjhjhjhjhjjhj",
//     },
//     {
//       id: "2",
//       name: "Dityo Hendyawan",
//       email: "dityohendyawan@yahoo.com",
//       phone: "081184180678",
//       dob: "30 January 2001",
//       domicile: "Jakarta",
//       gender: "Male",
//       linkedin: "https://www.linkedin.com/in/user2",
//     },
//     // ...add more
//   ];

//   useEffect(() => {
//     // Simulate API fetch
//     const fetchCandidates = async () => {
//       try {
//         // Replace this with your actual API call later:
//         // const res = await fetch("/api/candidates");
//         // const data = await res.json();
//         const data = mockCandidates;
//         setCandidates(data);
//       } catch (error) {
//         console.error("Error fetching candidates:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCandidates();
//   }, []);

//   return (
//     <div className="space-y-6 p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center  ">
//         <div className="flex items-center gap-2">
//           <button className="text-black text-m-bold bg-neutral-10 border border-neutral-40 rounded-[8px] px-4 py-1 shadow-sm">
//             Job list
//           </button>
//           <span className="text-neutral-100 text-2xl">›</span>
//           <button className="text-black text-m-bold bg-neutral-30 border border-neutral-50 rounded-[8px] px-4 py-1 shadow-sm">
//             Manage Candidate
//           </button>
//         </div>

//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 bg-primary-main text-white rounded-full flex items-center justify-center text-sm font-semibold">
//             M
//           </div>
//         </div>
//       </div>

//       <hr className="h-px bg-neutral-300 w-full"></hr>

//       <h2 className="text-xl font-bold text-neutral-100">
//         Front End Developer
//       </h2>

//       <div className="bg-white rounded-xl shadow-sm p-6">
//         {isLoading ? (
//           <p className="text-neutral-60">Loading candidates...</p>
//         ) : candidates.length === 0 ? (
//           <EmptyStateCandidate />
//         ) : (
//           <CandidateTable candidates={candidates} />
//         )}
//       </div>
//     </div>
//   );
// }
