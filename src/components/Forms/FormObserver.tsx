// @ts-nocheck

import { useEffect } from 'react'

export function FormObserver({ onChange, values }) {
  useEffect(() => {
    onChange(values);
  }, [Object.values(values).join(', ')]);

  return null;
}

FormObserver.defaultProps = {
  onChange: () => null,
};
