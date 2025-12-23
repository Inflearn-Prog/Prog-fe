// zustand 공식문서: https://docs.pmnd.rs/zustand/getting-started/introduction

import { create } from "zustand";

const INITIAL_COUNTER_VALUE = 5;

interface Counter {
  count: number;
  setCount: (val: number) => void;
  resetCount: () => void;
}

export const useCounter = create<Counter>((set) => ({
  count: INITIAL_COUNTER_VALUE,
  setCount: (val: number) => {
    try {
      set({ count: val });
    } catch (error) {
      console.error(
        "카운터 값을 설정하는 중 에러 발생:",
        error
      );
    }
  },
  resetCount: () => {
    try {
      set({ count: INITIAL_COUNTER_VALUE });
    } catch (error) {
      console.error(
        "카운터 값을 리셋하는 중 에러 발생:",
        error
      );
    }
  },
}));
