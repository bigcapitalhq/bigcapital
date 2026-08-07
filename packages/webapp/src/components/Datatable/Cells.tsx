import React from 'react';
import type { Cell } from 'react-table';

interface CellTextSpanProps {
  cell: Cell<any>;
}

export function CellTextSpan({ cell: { value } }: CellTextSpanProps) {
  return <span className="cell-text">{value}</span>;
}
