"use client";

import { useCounter } from "../_stores/useCounter";

export default function Count() {
  const { count } = useCounter();
  return (
    <div className="p-2 border inline-block">
      <h2>Count: {count}</h2>
      <Counter />
    </div>
  );
}

function Counter() {
  const { count, setCount, resetCount } = useCounter();
  return (
    <div>
      <button className="border p-2" onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button className="border p-2" onClick={() => setCount(count - 1)}>
        decrement
      </button>
      <button className="border p-2" onClick={resetCount}>
        reset
      </button>
    </div>
  );
}
