export type CheckKeys = "terms" | "privacy" | "marketing";

export interface ChecksState {
  all: boolean;
  terms: boolean;
  privacy: boolean;
  marketing: boolean;
}

export interface SignupState {
  step: number;
  nickname: string;
  icon: string;
  currentState: string;
  otherInput: string;
  targetJobs: string[];
  education: string;
  field: string;
  career: string;
  checks: ChecksState;
}