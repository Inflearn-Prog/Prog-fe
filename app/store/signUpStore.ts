import { create } from "zustand";

type SignupFieldKey = Exclude<
  keyof SignupState,
  | "setSocialInfo"
  | "setNickname"
  | "setSelectedProfileType"
  | "setTargetJobs"
  | "updateMajor"
  | "reset"
>;

interface SignupState {
  // 소셜로부터 받은 기본 정보
  email: string;
  provider: string;
  profileImage: string;

  // 유저가 단계별로 채워넣을 정보
  nickname: string;
  selectedProfileType: "SOCIAL" | "DEFAULT";
  targetJobs: string[];
  educationLevel: string;
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
  updateField: <K extends SignupFieldKey>(
    key: K,
    value: SignupState[K]
  ) => void;
  reset: () => void;
}

const INITIAL_SIGNUP_STATE = {
  email: "",
  provider: "",
  profileImage: "",
  nickname: "",
  selectedProfileType: "SOCIAL" as const,
  targetJobs: [],
  educationLevel: "",
  field: "",
  career: "",
};
export const useSignupStore = create<SignupState>((set) => ({
  ...INITIAL_SIGNUP_STATE,

  setSocialInfo: (info) => set((state) => ({ ...state, ...info })),
  setNickname: (nickname) => set({ nickname }),
  setSelectedProfileType: (type) => set({ selectedProfileType: type }),
  setTargetJobs: (targetJobs) => set({ targetJobs }),
  updateField: (key, value) => set({ [key]: value }),
  reset: () => set(INITIAL_SIGNUP_STATE),
}));
