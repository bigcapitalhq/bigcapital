import React from 'react';

export function useWhen(condition: boolean, callback: () => void) {
  React.useEffect(() => {
    if (condition) {
      callback();
    }
  }, [condition, callback]);
}

export function useWhenNot(condition: boolean, callback: () => void) {
  return useWhen(!condition, callback);
}
