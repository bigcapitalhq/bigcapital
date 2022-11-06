// @ts-nocheck
import { useEffect, useRef } from 'react';

export function useWatch(callback, argument) {
  const flag = useRef(false);

  useEffect(() => {
    if (!flag.current) {
      flag.current = true;
      return;
    }
    callback(argument);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [argument]);
}

export function useWatchImmediate(callback, argument) {
  useEffect(() => {
    callback(argument);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [argument]);
}
