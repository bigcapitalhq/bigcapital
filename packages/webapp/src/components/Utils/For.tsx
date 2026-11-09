import React from 'react';

export interface ForProps<T> {
  render: (item: T, index: number) => React.ReactNode;
  of: T[];
}

export function For<T>({ render, of }: ForProps<T>) {
  return <>{of.map((item, index) => render(item, index))}</>;
}
