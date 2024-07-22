import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, deley?: number): T {
  const [debounceValue, setDebounceValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value)
    }, deley || 500)

    return () => {
      clearTimeout(timer);
    }
  }, [deley, value]);

  return debounceValue;
}