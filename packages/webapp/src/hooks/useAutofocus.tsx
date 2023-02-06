// @ts-nocheck
import { useRef, useEffect } from 'react';

export default function useAutofocus(focus = true) {
  const ref = useRef();

  useEffect(() => {
    if (ref.current && focus) {
      ref.current.focus();
    }
  }, [ref, focus]);

  return ref;
}
