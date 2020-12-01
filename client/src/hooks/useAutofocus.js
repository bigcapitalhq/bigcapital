import { useRef, useEffect } from 'react';

export default function useAutofocus() {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [ref]);

  return ref;
}
