"use client";

import { useState } from "react";
import { Job } from "@/app/data/job";
import DomicileSelect from "./domicileselect";
import CountrySelect from "./countryselect";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supabase";
import HandGestureCamera from "@/components/handgestures/HandGestureCamera";
import { auth } from "@/services/firebase";

//

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

const base64ToBlob = (base64: string) => {
  const byteString = atob(base64.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: "image/jpeg" });
};

const ResumeForm: React.FC<ResumeFormProps> = ({ job }) => {
  const { formFields } = job;
  const [values, setValues] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});

  const [showCameraModal, setShowCameraModal] = useState(false); // for opening camera modal
  const [photoUrl, setPhotoUrl] = useState(""); // store uploaded photo URL
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);

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

    // if (isOn(formFields.dateOfBirth) && isRequired(formFields.dateOfBirth)) {
    //   if (!v.dateOfBirth) e.dateOfBirth = "Required";
    //   else if (!pastDate(v.dateOfBirth)) e.dateOfBirth = "Select a past date";
    // }

    // --- Date of Birth validation ---
    if (isOn(formFields.dateOfBirth) && isRequired(formFields.dateOfBirth)) {
      if (!v.dateOfBirth) {
        e.dateOfBirth = "Required";
      } else if (!pastDate(v.dateOfBirth)) {
        e.dateOfBirth = "You must be at least 17 years old";
      } else {
        // Check age >= 17
        const birthDate = new Date(v.dateOfBirth + "T00:00:00");
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        // Adjust if birth month/day not passed yet
        const actualAge = m < 0 || (m === 0 && dayDiff < 0) ? age - 1 : age;

        if (actualAge < 17) {
          e.dateOfBirth = "You must be at least 17 years old";
        }
      }
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

  // const handleSubmit = async (e: React.FormEvent) => {
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

  //   if (Object.keys(errs).length > 0) {
  //     const first = Object.keys(errs)[0] as keyof Values;
  //     const el = document.getElementsByName(String(first))[0];
  //     if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  //     return;
  //   }

  //   // ✅ Construct payload for Supabase
  //   const payload = {
  //     job_id: job.id, // Foreign key
  //     fullName: values.fullName,
  //     dateOfBirth: values.dateOfBirth,
  //     gender: values.gender,
  //     domicile: values.domicile,
  //     phoneNumber: values.phoneNumber,
  //     email: values.email,
  //     linkedinLink: values.linkedinLink,
  //     photoProfile: photoUrl,
  //   };

  //   console.log("Submitting to Supabase:", payload);

  //   // ✅ Insert into Supabase
  //   const { data, error } = await supabase
  //     .from("resume_submissions")
  //     .insert([payload])
  //     .select();

  //   if (error) {
  //     console.error("❌ Supabase insert error:", error);
  //     alert("Failed to submit application. Please try again.");
  //     return;
  //   }

  //   console.log("✅ Submitted successfully:", data);

  //   // Optionally show success and redirect or reset form
  //   alert("Your application has been submitted!");
  //   setValues(initialValues);
  //   router.push(`/apply/success`); // optional redirect
  // };
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

    // --- Upload photo if user has taken one ---
    let uploadedPhotoUrl: string | null = null;
    if (photoBase64) {
      const fileName = `profile-${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("profile-photos")
        .upload(fileName, base64ToBlob(photoBase64), {
          contentType: "image/jpeg",
        });

      if (uploadError) return alert("Failed to upload photo.");

      const { data: publicData } = supabase.storage
        .from("profile-photos")
        .getPublicUrl(fileName);

      uploadedPhotoUrl = publicData?.publicUrl ?? null;
    }

    // --- Get Firebase UID ---
    const user = auth.currentUser;
    if (!user) return alert("You must be logged in to submit.");
    const userUid = user.uid;
    console.log("User UID:", userUid);

    // ✅ Construct payload with uploaded photo URL
    const payload = {
      job_id: job.id,
      fullName: values.fullName,
      dateOfBirth: values.dateOfBirth,
      gender: values.gender,
      domicile: values.domicile,
      phoneNumber: values.phoneNumber,
      email: values.email,
      linkedinLink: values.linkedinLink,
      photoProfile: uploadedPhotoUrl,
      uid: userUid,
    };

    console.log("Submitting to Supabase:", payload);

    const { data, error } = await supabase
      .from("resume_submissions")
      .insert([payload])
      .select();

    if (error) {
      console.error("❌ Supabase insert error:", error);
      alert("Failed to submit application. Please try again.");
      return;
    }

    alert("Your application has been submitted!");
    setValues(initialValues);
    setPhotoBase64(null); // reset preview
    router.push(`/apply/success`);
  };

  // --- Back Button ---
  const router = useRouter();

  const handleBack = () => {
    router.back(); // ⬅️ Goes back to the previous page
  };

  // --- Render ---
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="p-6 bg-white rounded-lg shadow w-full max-w-lg"
      // onSubmit={handleSubmit}
    >
      <div className="border-2">
        <div className="px-6 pt-8 flex flex-row gap-4 items-center">
          <div
            onClick={handleBack}
            className="flex items-center justify-center rounded-lg border border-neutral-40 bg-neutral-10 w-7 h-7 cursor-pointer hover:bg-neutral-20"
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
          {photoBase64 ? (
            <img
              src={photoBase64}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-s border"
            />
          ) : (
            <img
              src="/profilepicture.svg"
              alt="job-logo"
              className="w-32 h-32 object-cover rounded-s border"
            />
          )}

          {/* <img src="/profilepicture.svg" alt="job-logo" />
          
          {photoUrl && (
            <div className="mt-2 flex flex-col items-center">
              <img
                src={photoUrl}
                alt="Profile"
                className="w-24 h-24 object-cover rounded-full border"
              />
              <button
                type="button"
                onClick={() => setPhotoUrl("")}
                className="text-sm text-red-500 mt-2"
              >
                Retake
              </button>
            </div>
          )} */}

          <button
            type="button"
            className="bg-neutral-10 rounded-xl border border-neutral-40 py-1 px-4 text-m-bold text-neutral-100"
            onClick={() => setShowCameraModal(true)}
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
        type="button"
        onClick={handleSubmit}
        className="mt-6 bg-primary-main text-white px-6 py-2 rounded-xl hover:bg-primary-hover w-full text-l-bold"
      >
        Submit
      </button>

      {showCameraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg p-4 max-w-lg w-full relative">
            <div className="flex flex-row justify-between px-2">
              <p>
                <span className="font-bold">Raise Your Hand to Capture</span>{" "}
                <br></br>
                <span className="text-[12px] font-medium">
                  We’ll take the photo once your hand pose is detected.
                </span>
              </p>
              <button
                type="button"
                onClick={() => setShowCameraModal(false)}
                className=" text-neutral-500 hover:text-neutral-800 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            {/* <HandGestureCamera
              onPhotoTaken={async (base64Url: string) => {
                // 1. Upload to Supabase Storage
                const fileName = `profile-${Date.now()}.jpg`;
                const { data, error: uploadError } = await supabase.storage
                  .from("profile-photos") // your bucket name
                  .upload(fileName, base64ToBlob(base64Url), {
                    contentType: "image/jpeg",
                  });

                if (uploadError) {
                  console.error("Upload error:", uploadError);
                  alert("Failed to upload photo.");
                  return;
                }

                // 2. Get public URL
                const { data: publicData } = supabase.storage
                  .from("profile-photos")
                  .getPublicUrl(fileName);

                if (!publicData?.publicUrl) {
                  console.error("Failed to get photo URL.");
                  alert("Failed to get photo URL.");
                  return;
                }

                // 3. Save URL to state
                setPhotoUrl(publicData.publicUrl);
                setShowCameraModal(false); // close modal
              }}
            /> */}
            {/* // on photo taken */}
            <HandGestureCamera
              onPhotoTaken={(base64Url: string) => {
                setPhotoBase64(base64Url); // just preview
                setShowCameraModal(false);
              }}
            />
            <div className=" flex flex-col space-y-4 text-[12px] font-medium px-2">
              <p>
                To take a picture, follow the hand poses in the order shown
                below.
                <br></br>The system will automatically capture the image once
                the final pose is detected.
              </p>

              <div className="flex flex-row gap-2 justify-center items-center">
                <img src="/one.svg" alt="one"></img>
                <p className="text-lg">{">"}</p>
                <img src="/two.svg" alt="two"></img>
                <p className="text-lg">{">"}</p>
                <img src="/three.svg" alt="three"></img>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>

    // Modal
  );
};

export default ResumeForm;
