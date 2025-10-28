// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/app/lib/supabase";
// import { Job } from "@/app/data/job";
// import DomicileSelect from "./domicileselect";
// import CountrySelect from "./countryselect";

// interface ResumeFormProps {
//   jobId: string;
// }

// type FieldStatus = "Mandatory" | "Optional" | "Off";

// export default function ResumeForm({ jobId }: ResumeFormProps) {
//   const [job, setJob] = useState<Job | null>(null);
//   const [loading, setLoading] = useState(true);

//   // ✅ Fetch job details including formFields
//   useEffect(() => {
//     const fetchJob = async () => {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from("job")
//         .select("*")
//         .eq("id", jobId)
//         .single();

//       if (error) console.error("Error fetching job:", error);
//       else setJob(data);
//       setLoading(false);
//     };

//     fetchJob();
//   }, [jobId]);

//   if (loading)
//     return (
//       <div className="flex items-center justify-center h-64 text-neutral-60">
//         Loading form...
//       </div>
//     );

//   if (!job)
//     return (
//       <div className="flex items-center justify-center h-64 text-red-500">
//         Job not found
//       </div>
//     );

//   const { formFields } = job;
//   console.log("Job data:", job);
//   console.log("Form fields:", formFields);

//   // --- Helper to render inputs dynamically
//   const renderField = (
//     label: string,
//     name: string,
//     type: string,
//     fieldStatus: FieldStatus
//   ) => {
//     if (fieldStatus === "Off") return null;

//     const isRequired = fieldStatus === "Mandatory";

//     return (
//       <div className="mb-4" key={name}>
//         <label className="block font-medium mb-1">
//           {label}
//           {isRequired && <span className="text-red-500 ml-1">*</span>}
//         </label>
//         <input
//           type={type}
//           name={name}
//           required={isRequired}
//           className="w-full border-2 rounded-sm border-neutral-60 focus:border-primary-border outline-none py-1 px-2 placeholder:text-neutral-60"
//           placeholder={`Enter your ${label.toLowerCase()}`}
//         />
//       </div>
//     );
//   };

//   return (
//     <form className="p-6 bg-white rounded-lg shadow w-full max-w-lg">
//       <div className="border-2">
//         <div className="px-6 pt-8 flex flex-row gap-4 items-center">
//           <i className="h-6 w-6 ri-arrow-left-line"></i>
//           <p className="pt-4 text-[14px] font-bold mb-4">
//             Apply for {job.title} at {job.company}
//           </p>
//         </div>

//         <div className="px-6 space-y-4 text-s-regular text-neutral-90">
//           <p className="text-danger-main">* Required</p>

//           {/* Photo Profile */}
//           {formFields.photoProfile !== "Off" && (
//             <div>
//               <span className="block font-medium mb-1">
//                 Photo Profile
//                 {formFields.photoProfile === "Mandatory" && (
//                   <span className="text-red-500 ml-1">*</span>
//                 )}
//               </span>
//               <img src="/profilepicture.svg" alt="job-logo" />
//               <button
//                 type="button"
//                 className="bg-neutral-10 rounded-[8px] border border-neutral-40 py-1 px-4 text-m-bold text-neutral-100"
//               >
//                 <i className="ri-upload-2-fill pr-1"></i>
//                 Take a Picture
//               </button>
//             </div>
//           )}

//           {/* Basic Fields */}
//           {renderField("Full name", "fullName", "text", formFields.fullName)}
//           {renderField(
//             "Date of Birth",
//             "dateOfBirth",
//             "date",
//             formFields.dateOfBirth
//           )}

//           {/* Gender Field */}
//           {formFields.gender !== "Off" && (
//             <div className="mb-4">
//               <label className="block font-medium mb-2">
//                 Pronoun (gender)
//                 {formFields.gender === "Mandatory" && (
//                   <span className="text-red-500 ml-1">*</span>
//                 )}
//               </label>
//               <div className="flex items-center gap-6">
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     name="gender"
//                     value="female"
//                     required={formFields.gender === "Mandatory"}
//                   />
//                   <span>She/her (Female)</span>
//                 </label>
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     name="gender"
//                     value="male"
//                     required={formFields.gender === "Mandatory"}
//                   />
//                   <span>He/him (Male)</span>
//                 </label>
//               </div>
//             </div>
//           )}

//           {/* Domicile */}
//           {formFields.domicile !== "Off" && (
//             <div className="mb-4">
//               <label className="block font-medium mb-1">
//                 Domicile
//                 {formFields.domicile === "Mandatory" && (
//                   <span className="text-red-500 ml-1">*</span>
//                 )}
//               </label>
//               {/* <DomicileSelect /> */}
//             </div>
//           )}

//           {/* Phone Number */}
//           {formFields.phoneNumber !== "Off" && (
//             <div className="mb-4">
//               <label className="block font-medium mb-1">
//                 Phone number
//                 {formFields.phoneNumber === "Mandatory" && (
//                   <span className="text-red-500 ml-1">*</span>
//                 )}
//               </label>
//               {/* <CountrySelect /> */}
//             </div>
//           )}

//           {/* Email */}
//           {renderField("Email", "email", "email", formFields.email)}

//           {/* LinkedIn */}
//           {renderField(
//             "LinkedIn Link",
//             "linkedinLink",
//             "url",
//             formFields.linkedinLink
//           )}
//         </div>
//       </div>

//       <button
//         type="submit"
//         className="mt-6 bg-primary-main text-white px-6 py-2 rounded-[8px] hover:bg-primary-hover w-full text-l-bold text-neutral-10"
//       >
//         Submit
//       </button>
//     </form>
//   );
// }

// import { Job } from "@/app/data/job";
// import DomicileSelect from "./domicileselect";
// import CountrySelect from "./countryselect";

// interface ResumeFormProps {
//   job: Job;
// }

// const ResumeForm: React.FC<ResumeFormProps> = ({ job }) => {
//   const { formFields } = job;

//   // Helper to render each input dynamically
//   const renderField = (
//     label: string,
//     name: string,
//     type: string,
//     fieldStatus: "Mandatory" | "Optional" | "Off"
//   ) => {
//     if (fieldStatus === "Off") return null; // don't render field if "Off"

//     const isRequired = fieldStatus === "Mandatory";

//     return (
//       <div className="mb-4" key={name}>
//         <label className="block font-medium mb-1">
//           {label}
//           {isRequired && <span className="text-red-500 ml-1">*</span>}
//         </label>
//         <input
//           type={type}
//           name={name}
//           required={isRequired}
//           className="w-full border-2 rounded-sm border-neutral-60 focus:border-primary-border outline-none py-1 px-2  placeholder:text-neutral-60"
//           placeholder={`Enter your ${label.toLowerCase()}`}
//         />
//       </div>
//     );
//   };

//   return (
//     <form className="p-6 bg-white rounded-lg shadow w-full max-w-lg">
//       <div className=" border-2">
//         <div className="px-6 pt-8 flex flex-row gap-4 items-center  ">
//           <i className="h-6 w-6 ri-arrow-left-line"></i>
//           <p className="pt-4 text-[14px] font-bold mb-4">
//             Apply for {job.title} at {job.company}
//           </p>
//         </div>

//         <div className="px-6 space-y-4 text-s-regular text-neutral-90 ">
//           <p className=" text-danger-main">* Required</p>
//           <span className="">Photo Profile</span>
//           <img src="/profilepicture.svg" alt="job-logo" />
//           <button className="bg-neutral-10 rounded-[8px] border border-neutral-40 py-1 px-4 text-m-bold text-neutral-100">
//             <i className="ri-upload-2-fill pr-1"></i>
//             Take a Picture
//           </button>

//           {renderField(
//             "Full name",
//             "fullName",
//             "text",
//             job.formFields.fullName
//           )}
//           {renderField(
//             "Date of Birth",
//             "dateOfBirth",
//             "date",
//             job.formFields.dateOfBirth
//           )}

//           {/* {renderField("Pronoun (gender)", "gender", "text", formFields.gender)} */}
//           {/* Gender Field - Radio Buttons */}
//           {job.formFields.gender !== "Off" && (
//             <div className="mb-4">
//               <label className="block font-medium mb-2">
//                 Pronoun (gender)
//                 {job.formFields.gender === "Mandatory" && (
//                   <span className="text-red-500 ml-1">*</span>
//                 )}
//               </label>
//               <div className="flex items-center gap-6">
//                 <label className="flex items-center gap-2">
//                   <input type="radio" name="gender" value="female" required />
//                   <span>She/her (Female)</span>
//                 </label>
//                 <label className="flex items-center gap-2">
//                   <input type="radio" name="gender" value="male" required />
//                   <span>He/him (Male)</span>
//                 </label>
//               </div>
//             </div>
//           )}
//           {/* {renderField("Domicile", "domicile", "text", formFields.domicile)} */}

//           {formFields.domicile !== "Off" && (
//             <div className="mb-4">
//               <label className="block font-medium mb-1">
//                 Domicile
//                 {job.formFields.domicile === "Mandatory" && (
//                   <span className="text-red-500 ml-1">*</span>
//                 )}
//               </label>
//               {/* <DomicileSelect /> */}
//             </div>
//           )}

//           {job.formFields.phoneNumber !== "Off" && (
//             <div className="mb-4">
//               <label className="block font-medium mb-1">
//                 Phone number
//                 {job.formFields.domicile === "Mandatory" && (
//                   <span className="text-red-500 ml-1">*</span>
//                 )}
//               </label>
//               {/* <CountrySelect /> */}
//             </div>
//           )}

//           {renderField("Email", "email", "email", formFields.email)}
//           {renderField(
//             "Link LinkedIn",
//             "linkedinLink",
//             "url",
//             formFields.linkedinLink
//           )}
//         </div>
//       </div>

//       <button
//         type="submit"
//         className="mt-6 bg-primary-main text-white px-6 py-2 rounded-[8px] hover:bg-primary-hover w-full text-l-bold text-neutral-10"
//       >
//         Submit
//       </button>
//     </form>
//   );
// };

// export default ResumeForm;

// import { useState } from "react";
// import { Job } from "@/app/data/job";
// import DomicileSelect from "./domicileselect";
// import CountrySelect from "./countryselect";

// interface ResumeFormProps {
//   job: Job;
// }

// type FieldStatus = "Mandatory" | "Optional" | "Off";

// type Values = {
//   fullName: string;
//   dateOfBirth: string; // yyyy-mm-dd
//   gender: "female" | "male" | "";
//   domicile: string;
//   phoneNumber: string; // digits only (after CountrySelect)
//   email: string;
//   linkedinLink: string;
// };

// type Errors = Partial<Record<keyof Values, string>>;
// type Touched = Partial<Record<keyof Values, boolean>>;

// const initialValues: Values = {
//   fullName: "",
//   dateOfBirth: "",
//   gender: "",
//   domicile: "",
//   phoneNumber: "",
//   email: "",
//   linkedinLink: "",
// };

// const ResumeForm: React.FC<ResumeFormProps> = ({ job }) => {
//   const { formFields } = job;
//   const [values, setValues] = useState<Values>(initialValues);
//   const [errors, setErrors] = useState<Errors>({});
//   const [touched, setTouched] = useState<Touched>({});

//   const isOn = (f: FieldStatus) => f !== "Off";
//   const isRequired = (f: FieldStatus) => f === "Mandatory";

//   // --- Validators ---
//   const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

//   const linkedInOk = (v: string) => {
//     if (!v.trim()) return false;
//     try {
//       const u = new URL(v);
//       // Be lenient but encourage profile URLs
//       return (
//         u.hostname.endsWith("linkedin.com") &&
//         (u.pathname.startsWith("/in/") ||
//           u.pathname.startsWith("/pub/") ||
//           u.pathname.startsWith("/company/"))
//       );
//     } catch {
//       return false;
//     }
//   };

//   const pastDate = (iso: string) => {
//     if (!iso) return false;
//     const d = new Date(iso + "T00:00:00");
//     const today = new Date();
//     return !isNaN(d.getTime()) && d < today;
//   };

//   const digits = (s: string) => s.replace(/\D/g, "");

//   const validate = (v: Values): Errors => {
//     const e: Errors = {};

//     if (isOn(formFields.fullName) && isRequired(formFields.fullName)) {
//       if (!v.fullName.trim()) e.fullName = "Required";
//     }

//     if (isOn(formFields.dateOfBirth) && isRequired(formFields.dateOfBirth)) {
//       if (!v.dateOfBirth) e.dateOfBirth = "Required";
//       else if (!pastDate(v.dateOfBirth)) e.dateOfBirth = "Select a past date";
//     }

//     if (isOn(formFields.gender) && isRequired(formFields.gender)) {
//       if (!v.gender) e.gender = "Required";
//     }

//     if (isOn(formFields.domicile) && isRequired(formFields.domicile)) {
//       if (!v.domicile) e.domicile = "Required";
//     }

//     if (isOn(formFields.phoneNumber) && isRequired(formFields.phoneNumber)) {
//       const d = digits(v.phoneNumber);
//       if (!d) e.phoneNumber = "Required";
//       else if (d.length < 8) e.phoneNumber = "Enter at least 10 digits";
//     }

//     if (isOn(formFields.email) && isRequired(formFields.email)) {
//       if (!v.email.trim()) e.email = "Required";
//       else if (!emailOk(v.email)) e.email = "Please enter a valid email";
//     } else if (isOn(formFields.email) && v.email) {
//       if (!emailOk(v.email)) e.email = "Please enter a valid email";
//     }

//     if (isOn(formFields.linkedinLink) && isRequired(formFields.linkedinLink)) {
//       if (!v.linkedinLink.trim()) e.linkedinLink = "Required";
//       else if (!linkedInOk(v.linkedinLink))
//         e.linkedinLink =
//           "Use a valid LinkedIn URL (e.g. https://www.linkedin.com/in/username)";
//     } else if (isOn(formFields.linkedinLink) && v.linkedinLink) {
//       if (!linkedInOk(v.linkedinLink))
//         e.linkedinLink =
//           "Use a valid LinkedIn URL (e.g. https://www.linkedin.com/in/username)";
//     }

//     return e;
//   };

//   // --- Handlers ---
//   const setValue = <K extends keyof Values>(key: K, val: Values[K]) => {
//     const next = { ...values, [key]: val };
//     setValues(next);
//     // live-validate if field already touched
//     if (touched[key]) setErrors(validate(next));
//   };

//   const handleBlur = (key: keyof Values) => {
//     const t = { ...touched, [key]: true };
//     setTouched(t);
//     setErrors(validate(values));
//   };

//   const borderClass = (key: keyof Values) =>
//     touched[key] && errors[key]
//       ? "border-danger-main focus:border-danger-main"
//       : "border-neutral-60 focus:border-primary-border";

//   const helpText = (key: keyof Values) =>
//     touched[key] && errors[key] ? (
//       <p className="mt-1 text-s-regular text-danger-main">{errors[key]}</p>
//     ) : null;

//   // --- Render helper for simple inputs ---
//   const renderField = (
//     label: string,
//     name: keyof Values,
//     type: string,
//     fieldStatus: FieldStatus,
//     placeholder?: string
//   ) => {
//     if (fieldStatus === "Off") return null;
//     const required = fieldStatus === "Mandatory";

//     return (
//       <div className="mb-4" key={String(name)}>
//         <label className="block font-medium mb-1">
//           {label}
//           {required && <span className="text-red-500 ml-1">*</span>}
//         </label>
//         <input
//           type={type}
//           name={name}
//           required={required}
//           value={values[name] as string}
//           onChange={(e) =>
//             setValue(
//               name,
//               (type === "date" ? e.target.value : e.target.value) as any
//             )
//           }
//           onBlur={() => handleBlur(name)}
//           aria-invalid={!!(touched[name] && errors[name])}
//           aria-describedby={`${name}-help`}
//           className={`w-full border-2 rounded-sm outline-none py-1 px-2 placeholder:text-neutral-60 ${borderClass(
//             name
//           )}`}
//           placeholder={placeholder ?? `Enter your ${label.toLowerCase()}`}
//         />
//         <div id={`${name}-help`}>{helpText(name)}</div>
//       </div>
//     );
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // mark everything touched once
//     const allTouched: Touched = {
//       fullName: true,
//       dateOfBirth: true,
//       gender: true,
//       domicile: true,
//       phoneNumber: true,
//       email: true,
//       linkedinLink: true,
//     };
//     setTouched(allTouched);

//     const errs = validate(values);
//     setErrors(errs);

//     if (Object.keys(errs).length === 0) {
//       // ✅ submit values
//       console.log("Submit payload:", values);
//       // ...send to API
//     } else {
//       // scroll to first error (nice UX)
//       const first = Object.keys(errs)[0] as keyof Values;
//       const el = document.getElementsByName(String(first))[0];
//       if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
//     }
//   };

//   return (
//     <form
//       className="p-6 bg-white rounded-lg shadow w-full max-w-lg"
//       onSubmit={handleSubmit}
//     >
//       <div className=" border-2">
//         <div className="px-6 pt-8 flex flex-row gap-4 items-center">
//           <i className="h-6 w-6 ri-arrow-left-line"></i>
//           <p className="pt-4 text-[14px] font-bold mb-4">
//             Apply for {job.title} at {job.company}
//           </p>
//         </div>

//         <div className="px-6 space-y-4 text-s-regular text-neutral-90">
//           <p className=" text-danger-main">* Required</p>
//           <span className="">Photo Profile</span>
//           <img src="/profilepicture.svg" alt="job-logo" />
//           <button
//             type="button"
//             className="bg-neutral-10 rounded-[8px] border border-neutral-40 py-1 px-4 text-m-bold text-neutral-100"
//           >
//             <i className="ri-upload-2-fill pr-1"></i>
//             Take a Picture
//           </button>

//           {renderField("Full name", "fullName", "text", formFields.fullName)}
//           {renderField(
//             "Date of birth",
//             "dateOfBirth",
//             "date",
//             formFields.dateOfBirth,
//             "Select your date of birth"
//           )}

//           {/* Gender radios */}
//           {isOn(formFields.gender) && (
//             <div className="mb-4">
//               <label className="block font-medium mb-2">
//                 Pronoun (gender)
//                 {isRequired(formFields.gender) && (
//                   <span className="text-red-500 ml-1">*</span>
//                 )}
//               </label>
//               <div
//                 className={`rounded-sm border-2 p-2 ${
//                   touched.gender && errors.gender
//                     ? "border-danger-main"
//                     : "border-neutral-60"
//                 }`}
//               >
//                 <div className="flex items-center gap-6">
//                   <label className="flex items-center gap-2">
//                     <input
//                       type="radio"
//                       name="gender"
//                       value="female"
//                       checked={values.gender === "female"}
//                       onChange={() => setValue("gender", "female")}
//                       onBlur={() => handleBlur("gender")}
//                       required={isRequired(formFields.gender)}
//                     />
//                     <span>She/her (Female)</span>
//                   </label>
//                   <label className="flex items-center gap-2">
//                     <input
//                       type="radio"
//                       name="gender"
//                       value="male"
//                       checked={values.gender === "male"}
//                       onChange={() => setValue("gender", "male")}
//                       onBlur={() => handleBlur("gender")}
//                       required={isRequired(formFields.gender)}
//                     />
//                     <span>He/him (Male)</span>
//                   </label>
//                 </div>
//               </div>
//               {helpText("gender")}
//             </div>
//           )}

//           {/* Domicile */}
//           {isOn(formFields.domicile) && (
//             <div className="mb-4">
//               <label className="block font-medium mb-1">
//                 Domicile
//                 {isRequired(formFields.domicile) && (
//                   <span className="text-red-500 ml-1">*</span>
//                 )}
//               </label>
//               <DomicileSelect
//                 value={values.domicile}
//                 onChange={(val: string) => setValue("domicile", val)}
//                 onBlur={() => handleBlur("domicile")}
//                 error={touched.domicile ? errors.domicile : undefined}
//               />
//             </div>
//           )}

//           {/* Phone number */}
//           {isOn(formFields.phoneNumber) && (
//             <div className="mb-4">
//               <label className="block font-medium mb-1">
//                 Phone number
//                 {isRequired(formFields.phoneNumber) && (
//                   <span className="text-red-500 ml-1">*</span>
//                 )}
//               </label>
//               <CountrySelect
//                 value={values.phoneNumber}
//                 onChange={(val: string) => setValue("phoneNumber", val)}
//                 onBlur={() => handleBlur("phoneNumber")}
//                 error={touched.phoneNumber ? errors.phoneNumber : undefined}
//               />
//             </div>
//           )}

//           {renderField("Email", "email", "email", formFields.email)}
//           {renderField(
//             "Link LinkedIn",
//             "linkedinLink",
//             "url",
//             formFields.linkedinLink,
//             "https://www.linkedin.com/in/username"
//           )}
//         </div>
//       </div>

//       <button
//         type="submit"
//         className="mt-6 bg-primary-main text-white px-6 py-2 rounded-[8px] hover:bg-primary-hover w-full text-l-bold text-neutral-10"
//       >
//         Submit
//       </button>
//     </form>
//   );
// };

// export default ResumeForm;

"use client";

import { useState } from "react";
import { Job } from "@/app/data/job";
import DomicileSelect from "./domicileselect";
import CountrySelect from "./countryselect";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

interface ResumeFormProps {
  job: Job;
}

type FieldStatus = "Mandatory" | "Optional" | "Off";

type Values = {
  fullName: string;
  dateOfBirth: string; // yyyy-mm-dd
  gender: "Female" | "Male" | "";
  domicile: string;
  phoneNumber: string; // digits only
  email: string;
  linkedinLink: string;
};

type Errors = Partial<Record<keyof Values, string>>;
type Touched = Partial<Record<keyof Values, boolean>>;

const initialValues: Values = {
  fullName: "",
  dateOfBirth: "",
  gender: "",
  domicile: "",
  phoneNumber: "",
  email: "",
  linkedinLink: "",
};

const ResumeForm: React.FC<ResumeFormProps> = ({ job }) => {
  const { formFields } = job;
  const [values, setValues] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});

  const isOn = (f: FieldStatus) => f !== "Off";
  const isRequired = (f: FieldStatus) => f === "Mandatory";

  // --- Validators ---
  const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const linkedInOk = (v: string) => {
    if (!v.trim()) return false;
    try {
      const u = new URL(v);
      return (
        u.hostname.endsWith("linkedin.com") &&
        (u.pathname.startsWith("/in/") ||
          u.pathname.startsWith("/pub/") ||
          u.pathname.startsWith("/company/"))
      );
    } catch {
      return false;
    }
  };
  const pastDate = (iso: string) => {
    if (!iso) return false;
    const d = new Date(iso + "T00:00:00");
    const today = new Date();
    return !isNaN(d.getTime()) && d < today;
  };
  const digits = (s: string) => s.replace(/\D/g, "");

  const validate = (v: Values): Errors => {
    const e: Errors = {};

    if (isOn(formFields.fullName) && isRequired(formFields.fullName)) {
      if (!v.fullName.trim()) e.fullName = "Required";
    }

    if (isOn(formFields.dateOfBirth) && isRequired(formFields.dateOfBirth)) {
      if (!v.dateOfBirth) e.dateOfBirth = "Required";
      else if (!pastDate(v.dateOfBirth)) e.dateOfBirth = "Select a past date";
    }

    if (isOn(formFields.gender) && isRequired(formFields.gender)) {
      if (!v.gender) e.gender = "Required";
    }

    if (isOn(formFields.domicile) && isRequired(formFields.domicile)) {
      if (!v.domicile) e.domicile = "Required";
    }

    if (isOn(formFields.phoneNumber) && isRequired(formFields.phoneNumber)) {
      const d = digits(v.phoneNumber);
      if (!d) e.phoneNumber = "Required";
      else if (d.length < 8) e.phoneNumber = "Enter at least 10 digits";
    }

    if (isOn(formFields.email) && isRequired(formFields.email)) {
      if (!v.email.trim()) e.email = "Required";
      else if (!emailOk(v.email)) e.email = "Please enter a valid email";
    } else if (isOn(formFields.email) && v.email) {
      if (!emailOk(v.email)) e.email = "Please enter a valid email";
    }

    if (isOn(formFields.linkedinLink) && isRequired(formFields.linkedinLink)) {
      if (!v.linkedinLink.trim()) e.linkedinLink = "Required";
      else if (!linkedInOk(v.linkedinLink))
        e.linkedinLink =
          "Use a valid LinkedIn URL (e.g. https://www.linkedin.com/in/username)";
    } else if (isOn(formFields.linkedinLink) && v.linkedinLink) {
      if (!linkedInOk(v.linkedinLink))
        e.linkedinLink =
          "Use a valid LinkedIn URL (e.g. https://www.linkedin.com/in/username)";
    }

    return e;
  };

  // --- Handlers ---
  const setValue = <K extends keyof Values>(key: K, val: Values[K]) => {
    const next = { ...values, [key]: val };
    setValues(next);
    if (touched[key]) setErrors(validate(next));
  };

  const handleBlur = (key: keyof Values) => {
    const t = { ...touched, [key]: true };
    setTouched(t);
    setErrors(validate(values));
  };

  const borderClass = (key: keyof Values) =>
    touched[key] && errors[key]
      ? "border-danger-main focus:border-danger-main"
      : "border-neutral-60 focus:border-primary-border";

  const helpText = (key: keyof Values) =>
    touched[key] && errors[key] ? (
      <p className="mt-1 text-s-regular text-danger-main">{errors[key]}</p>
    ) : null;

  // --- Label helper ---
  const FieldLabel = ({
    label,
    required,
  }: {
    label: string;
    required?: boolean;
  }) => (
    <label className="block font-medium mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  // --- Render simple input field ---
  const renderField = (
    label: string,
    name: keyof Values,
    type: string,
    fieldStatus: FieldStatus,
    placeholder?: string
  ) => {
    if (fieldStatus === "Off") return null;
    const required = fieldStatus === "Mandatory";

    return (
      <div className="mb-4" key={String(name)}>
        <FieldLabel label={label} required={required} />
        <input
          type={type}
          name={name}
          required={required}
          value={values[name] as string}
          onChange={(e) =>
            setValue(
              name,
              (type === "date" ? e.target.value : e.target.value) as any
            )
          }
          onBlur={() => handleBlur(name)}
          aria-invalid={!!(touched[name] && errors[name])}
          aria-describedby={`${name}-help`}
          className={`w-full border-2 rounded-sm outline-none py-1 px-2 placeholder:text-neutral-60 ${borderClass(
            name
          )}`}
          placeholder={placeholder ?? `Enter your ${label.toLowerCase()}`}
        />
        <div id={`${name}-help`}>{helpText(name)}</div>
      </div>
    );
  };

  // --- Submit ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched: Touched = {
      fullName: true,
      dateOfBirth: true,
      gender: true,
      domicile: true,
      phoneNumber: true,
      email: true,
      linkedinLink: true,
    };
    setTouched(allTouched);

    const errs = validate(values);
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      const first = Object.keys(errs)[0] as keyof Values;
      const el = document.getElementsByName(String(first))[0];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // ✅ Construct payload for Supabase
    const payload = {
      job_id: job.id, // Foreign key
      fullName: values.fullName,
      dateOfBirth: values.dateOfBirth,
      gender: values.gender,
      domicile: values.domicile,
      phoneNumber: values.phoneNumber,
      email: values.email,
      linkedinLink: values.linkedinLink,
    };

    console.log("Submitting to Supabase:", payload);

    // ✅ Insert into Supabase
    const { data, error } = await supabase
      .from("resume_submissions")
      .insert([payload])
      .select();

    if (error) {
      console.error("❌ Supabase insert error:", error);
      alert("Failed to submit application. Please try again.");
      return;
    }

    console.log("✅ Submitted successfully:", data);

    // Optionally show success and redirect or reset form
    alert("Your application has been submitted!");
    setValues(initialValues);
    router.push(`/apply/success`); // optional redirect
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const allTouched: Touched = {
  //     fullName: true,
  //     dateOfBirth: true,
  //     gender: true,
  //     domicile: true,
  //     phoneNumber: true,
  //     email: true,
  //     linkedinLink: true,
  //   };
  //   setTouched(allTouched);
  //   const errs = validate(values);
  //   setErrors(errs);

  //   if (Object.keys(errs).length === 0) {
  //     console.log("✅ Submit payload:", values);
  //     // send to API here
  //   } else {
  //     const first = Object.keys(errs)[0] as keyof Values;
  //     const el = document.getElementsByName(String(first))[0];
  //     if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  //   }
  // };

  // --- Back Button ---
  const router = useRouter();

  const handleBack = () => {
    router.back(); // ⬅️ Goes back to the previous page
  };

  // --- Render ---
  return (
    <form
      className="p-6 bg-white rounded-lg shadow w-full max-w-lg"
      onSubmit={handleSubmit}
    >
      <div className="border-2">
        <div className="px-6 pt-8 flex flex-row gap-4 items-center">
          <div
            onClick={handleBack}
            className="flex items-center justify-center rounded-[4px] border border-neutral-40 bg-neutral-10 w-7 h-7 cursor-pointer hover:bg-neutral-20"
          >
            <i className="ri-arrow-left-line text-[16px] leading-none text-neutral-80"></i>
          </div>

          <p className="pt-4 text-[14px] font-bold mb-4">
            Apply for {job.title} at {job.company}
          </p>
        </div>

        <div className="px-6 space-y-4 text-s-regular text-neutral-90">
          <p className="text-danger-main">* Required</p>

          <span>Photo Profile</span>
          <img src="/profilepicture.svg" alt="job-logo" />
          <button
            type="button"
            className="bg-neutral-10 rounded-[8px] border border-neutral-40 py-1 px-4 text-m-bold text-neutral-100"
          >
            <i className="ri-upload-2-fill pr-1"></i>
            Take a Picture
          </button>

          {/* BASIC FIELDS */}
          {renderField("Full name", "fullName", "text", formFields.fullName)}
          {renderField(
            "Date of birth",
            "dateOfBirth",
            "date",
            formFields.dateOfBirth,
            "Select your date of birth"
          )}

          {/* GENDER */}
          {isOn(formFields.gender) && (
            <div className="mb-4">
              <FieldLabel
                label="Pronoun (gender)"
                required={isRequired(formFields.gender)}
              />
              <div
                className={`rounded-sm border-2 p-2 ${
                  touched.gender && errors.gender
                    ? "border-danger-main"
                    : "border-neutral-60"
                }`}
              >
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={values.gender === "Female"}
                      onChange={() => setValue("gender", "Female")}
                      onBlur={() => handleBlur("gender")}
                      required={isRequired(formFields.gender)}
                    />
                    <span>She/her (Female)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={values.gender === "Male"}
                      onChange={() => setValue("gender", "Male")}
                      onBlur={() => handleBlur("gender")}
                      required={isRequired(formFields.gender)}
                    />
                    <span>He/him (Male)</span>
                  </label>
                </div>
              </div>
              {helpText("gender")}
            </div>
          )}

          {/* DOMICILE */}
          {isOn(formFields.domicile) && (
            <div className="mb-4">
              <FieldLabel
                label="Domicile"
                required={isRequired(formFields.domicile)}
              />
              <DomicileSelect
                value={values.domicile}
                onChange={(val: string) => setValue("domicile", val)}
                onBlur={() => handleBlur("domicile")}
                error={touched.domicile ? errors.domicile : undefined}
              />
            </div>
          )}

          {/* PHONE NUMBER */}
          {isOn(formFields.phoneNumber) && (
            <div className="mb-4">
              <FieldLabel
                label="Phone number"
                required={isRequired(formFields.phoneNumber)}
              />
              <CountrySelect
                value={values.phoneNumber}
                onChange={(val: string) => setValue("phoneNumber", val)}
                onBlur={() => handleBlur("phoneNumber")}
                error={touched.phoneNumber ? errors.phoneNumber : undefined}
              />
            </div>
          )}

          {/* EMAIL + LINKEDIN */}
          {renderField("Email", "email", "email", formFields.email)}
          {renderField(
            "Link LinkedIn",
            "linkedinLink",
            "url",
            formFields.linkedinLink,
            "https://www.linkedin.com/in/username"
          )}
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 bg-primary-main text-white px-6 py-2 rounded-[8px] hover:bg-primary-hover w-full text-l-bold text-neutral-10"
      >
        Submit
      </button>
    </form>
  );
};

export default ResumeForm;
