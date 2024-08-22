import { useEffect, useState } from "react";

const getLocalValue = <T>(key: string, initValue: T): T => {
  if (typeof window === "undefined") return initValue;

  try {
    const localValue = localStorage.getItem(key);
    if (localValue !== null) return JSON.parse(localValue);
  } catch (error) {
    console.error(`Error parsing localStorage value for key "${key}":`, error);
  }

  if (initValue instanceof Function) return (initValue as () => T)();

  return initValue;
};

const useLocalStorage = <T>(key: string, initValue: T) => {
  const [value, setValue] = useState<T>(() => {
    return getLocalValue(key, initValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
};

export default useLocalStorage;
