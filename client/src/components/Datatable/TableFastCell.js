import React, { memo } from 'react';
import TableCell from './TableCell';

function TableFastCell({ cell, row, index }) {
  return <TableCell cell={cell} row={row} index={index} />;
}

export default memo(TableFastCell, (prevProps, nextProps) => {
  if (
    prevProps.cell.value === nextProps.cell.value &&
    prevProps.cell.maxWidth ===  nextProps.cell.maxWidth &&
    prevProps.cell.width ===  nextProps.cell.width
  ) {
    return true;
  } else {
    return false;
  }
});