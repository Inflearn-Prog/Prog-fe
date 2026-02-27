import { create } from "zustand";

import {
  EducationValue,
  JobType,
  StateType,
} from "@/app/(beforeLogin)/(auth)/constant";

interface ProfileState {
  currentState: "" | StateType;
  targetJobs: JobType[];
  career: number;
  educationLevel: "" | EducationValue;

  // 상태 변경 액션
  updateField: <K extends keyof ProfileState>(
    field: K,
    value: ProfileState[K]
  ) => void;
  setTargetJobs: (jobs: JobType[]) => void;
  reset: () => void;
}

export const useMypageStore = create<ProfileState>((set) => ({
  currentState: "",
  targetJobs: [],
  career: 0,
  educationLevel: "",

  updateField: (field, value) => set((state) => ({ ...state, [field]: value })),
  setTargetJobs: (jobs) => set({ targetJobs: jobs }),
  reset: () =>
    set({ currentState: "", targetJobs: [], career: 0, educationLevel: "" }),
}));
