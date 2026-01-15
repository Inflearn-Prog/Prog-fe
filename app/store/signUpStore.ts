import { create } from "zustand";

interface SignupState {
  // 소셜로부터 받은 기본 정보
  email: string;
  provider: string;
  profileImage: string;

  // 유저가 단계별로 채워넣을 정보
  nickname: string;
  selectedProfileType: "SOCIAL" | "DEFAULT";
  targetJobs: string[];
  field: string;
  career: string;

  // 액션
  setSocialInfo: (info: {
    email: string;
    provider: string;
    profileImage: string;
  }) => void;
  setNickname: (name: string) => void;
  setSelectedProfileType: (type: "SOCIAL" | "DEFAULT") => void;
  setTargetJobs: (jobs: string[]) => void;
  updateField: <K extends keyof SignupState>(
    key: K,
    value: SignupState[K]
  ) => void;
  reset: () => void;
}

export const useSignupStore = create<SignupState>((set) => ({
  email: "",
  provider: "",
  profileImage: "",
  nickname: "",
  selectedProfileType: "SOCIAL",
  targetJobs: [],
  field: "",
  career: "",

  setSocialInfo: (info) => set((state) => ({ ...state, ...info })),
  setNickname: (nickname) => set({ nickname }),
  setSelectedProfileType: (type) => set({ selectedProfileType: type }),
  setTargetJobs: (targetJobs) => set({ targetJobs }),
  updateField: (key, value) => set((state) => ({ ...state, [key]: value })),
  reset: () =>
    set({
      email: "",
      provider: "",
      profileImage: "",
      nickname: "",
      selectedProfileType: "SOCIAL",
      targetJobs: [],
      field: "",
      career: "",
    }),
}));
