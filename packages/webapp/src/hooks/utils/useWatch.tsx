import { useEffect, useRef } from 'react';

export function useWatch<T>(callback: (argument: T) => void, argument: T) {
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

export function useWatchImmediate<T>(
  callback: (argument: T) => void,
  argument: T,
) {
  useEffect(() => {
    callback(argument);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [argument]);
}
