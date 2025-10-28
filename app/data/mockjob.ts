import { Job } from "./job";

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "UX Designer",
    company: "Rakamin",
    minSalary: 8000000,
    maxSalary: 12000000,
    status: "Active",
    type: "Full-Time",
    description: "Develop, test, and maintain responsive web applications using modern technologies, Collaborate with UI/UX designers to translate wireframes into functional code.,",
    startDate: "",
    location: "Jakarta, Indonesia",
    formFields: {
      fullName: "Mandatory",
      photoProfile: "Optional",
      gender: "Mandatory",
      domicile: "Mandatory",
      email: "Mandatory",
      phoneNumber: "Mandatory",
      linkedinLink: "Optional",
      dateOfBirth: "Optional"
    },
    candidateCount: 0
  },


];
