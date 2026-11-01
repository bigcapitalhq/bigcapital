import React, { memo } from 'react';
import TableCell from './TableCell';
import type { Cell, Row } from 'react-table';

interface TableFastCellProps {
  cell: Cell<any>;
  row: Row<any>;
  index?: number;
}

export function TableFastCell({ cell, row, index }: TableFastCellProps) {
  return <TableCell cell={cell} row={row} index={index} />;
}

export default memo(TableFastCell, (prevProps, nextProps) => {
  if (
    prevProps.row.canExpand === nextProps.row.canExpand &&
    prevProps.row.isExpanded === nextProps.row.isExpanded &&
    prevProps.cell.value === nextProps.cell.value &&
    prevProps.cell.column.maxWidth === nextProps.cell.column.maxWidth &&
    prevProps.cell.column.width === nextProps.cell.column.width
  ) {
    return true;
  } else {
    return false;
  }
});
