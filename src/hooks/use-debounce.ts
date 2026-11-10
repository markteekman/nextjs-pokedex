"use client";

import { useEffect, useState } from "react";

export function useDebounce(value: string, delay: number): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the previous timer when the value changes or the component unmounts.
    return () => window.clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}
