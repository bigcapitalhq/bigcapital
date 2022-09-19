// @ts-nocheck
import React from 'react';
import { get } from 'lodash';

import { getForceWidth } from '@/utils';

export function CellForceWidth({
  value,
  column: { forceWidthAccess },
  row: { original },
}) {
  const forceWidthValue = forceWidthAccess
    ? get(original, forceWidthAccess)
    : value;

  return <ForceWidth forceValue={forceWidthValue}>{value}</ForceWidth>;
}

export function ForceWidth({ children, forceValue }) {
  const forceWidthValue = forceValue || children;

  return (
    <span
      className={'force-width'}
      style={{ minWidth: getForceWidth(forceWidthValue) }}
    >
      {children}
    </span>
  );
}
