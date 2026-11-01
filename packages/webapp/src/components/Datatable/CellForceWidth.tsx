import { get } from 'lodash';
import React from 'react';
import { getForceWidth } from '@/utils';

interface CellForceWidthProps {
  value: React.ReactNode;
  column: { forceWidthAccess?: string };
  row: { original: any };
}

export function CellForceWidth({
  value,
  column: { forceWidthAccess },
  row: { original },
}: CellForceWidthProps) {
  const forceWidthValue = forceWidthAccess
    ? get(original, forceWidthAccess)
    : value;

  return <ForceWidth forceValue={forceWidthValue}>{value}</ForceWidth>;
}

interface ForceWidthProps {
  children: React.ReactNode;
  forceValue?: React.ReactNode;
}

export function ForceWidth({ children, forceValue }: ForceWidthProps) {
  const forceWidthValue = forceValue ?? children;

  return (
    <span
      className={'force-width'}
      style={{ minWidth: getForceWidth(String(forceWidthValue ?? '')) }}
    >
      {children}
    </span>
  );
}
