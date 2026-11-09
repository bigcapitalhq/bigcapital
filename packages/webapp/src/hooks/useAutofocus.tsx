import React, { useEffect, useRef } from 'react';

export default function useAutofocus<T extends HTMLElement = HTMLInputElement>(
  focus = true,
): React.MutableRefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (ref.current && focus) {
      ref.current.focus();
    }
  }, [ref, focus]);

  return ref;
}
