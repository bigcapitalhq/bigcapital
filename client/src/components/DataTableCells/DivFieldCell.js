import React, { useState, useEffect } from 'react';

export default function DivFieldCell({ cell: { value: initialValue } }) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <div>${value}</div>;
}
