import { initMsw } from "@/mocks";

export async function initializeMSW() {
  if (typeof window === "undefined" && process.env.NODE_ENV === "development") {
    await initMsw();
  }
}
