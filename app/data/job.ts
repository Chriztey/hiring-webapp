import { ResumeFieldConfig } from "./resumefieldconfig";

export interface Job {
  id: string;
  title: string;
  candidateCount: 0;
  
  minSalary: number;
  maxSalary: number;
  status: "Active" | "Inactive" | "Draft";
  startDate: string;
  company: "Rakamin";    
  location: "Jakarta, Indonesia";
  description: string;
  type: string;
  formFields: ResumeFieldConfig;
}