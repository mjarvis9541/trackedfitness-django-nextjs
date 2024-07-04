"use client";

import { useEffect, useState } from "react";

export default function useDebounce<State>(
  value: State,
  delay?: number
): State {
  const [debouncedValue, setDebouncedValue] = useState<State>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
