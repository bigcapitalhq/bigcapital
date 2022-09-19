// @ts-nocheck
import React from 'react';

export function useWhen(condition, callback) {
  React.useEffect(() => {
    if (condition) {
      callback();
    }
  }, [condition, callback]);
}

export function useWhenNot(condition, callback) {
  return useWhen(!condition, callback);
}
