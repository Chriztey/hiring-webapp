import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Job } from "../../data/job";

interface JobState {
  jobs: Job[];
  selectedJob: Job | null;
  loading: boolean;
}

const initialState: JobState = {
  jobs: [],
  selectedJob: null,
  loading: false,
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    setJobs(state, action: PayloadAction<Job[]>) {
      state.jobs = action.payload;
      state.loading = false;
    },
    startLoading(state) {
      state.loading = true;
    },
    setSelectedJob(state, action: PayloadAction<Job | null>) {
      state.selectedJob = action.payload;
    },
    addJob(state, action: PayloadAction<Job>) {
      state.jobs.push(action.payload);
    },
  },
});

export const { setJobs, startLoading, setSelectedJob, addJob } = jobSlice.actions;
export default jobSlice.reducer;
