import { authHandlers } from "./auth-handlers";
import { mswHandlers } from "./msw-test";
import { nicknameHandlers } from "./nickname-handlers";
import { onboardingHandlers } from "./onboarding-handlers";
import { termsHandlers } from "./terms-handlers";

export const handlers = [
  ...mswHandlers,
  ...termsHandlers,
  ...onboardingHandlers,
  ...authHandlers,
  ...nicknameHandlers,
];
