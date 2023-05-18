import React from "react";

// TODO: try implement as a queue
/* export function useDeb<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T,
  millis: number
): (...args: Parameters<T>) => void {
  const [debounce, setDebounce] = React.useState<number>();

  return (...args: Parameters<T>) => {
    if (debounce) {
      clearTimeout(debounce);
    }
    setDebounce(setTimeout(() => callback(...args), millis));
  };
} */

export function useDebounce(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (...args: any[]) => void,
  millis: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): (ignoreDebounce: boolean, ...args: any[]) => any {
  const [debounce, setDebounce] = React.useState<number>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (ignoreDebounce: boolean, ...args: any[]) => {
    if (debounce) {
      clearTimeout(debounce);
    }
    setDebounce(setTimeout(() => callback(...args), ignoreDebounce ? 0 : millis));
  };
}
