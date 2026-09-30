"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Persist a piece of state in LocalStorage.
 * SSR-safe: the initial render always uses `initialValue`, and the stored
 * value is loaded after hydration so server and client markup match.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw));
    } catch {
      /* corrupted entry — fall back to the default */
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or blocked — ignore */
    }
  }, [key, value, hydrated]);

  const reset = useCallback(() => setValue(initialValue), [initialValue]);

  return [value, setValue, { hydrated, reset }];
}
