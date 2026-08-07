import React, { useEffect, useRef } from 'react';
import type { TableState } from 'react-table';

export const isCellLoading = (
  loading: boolean | undefined,
  cellsCoords: Array<[number, string]> | undefined,
  rowIndex: number,
  columnId: string,
): boolean => {
  if (!loading) {
    return false;
  }
  return !cellsCoords
    ? true
    : cellsCoords.some(
        (cellCoord) => cellCoord[0] === rowIndex && cellCoord[1] === columnId,
      );
};

export const useResizeObserver = (
  state: TableState,
  callback: (
    currentColumnId: string,
    columnWidth: number,
    columnResizing: TableState['columnResizing'],
  ) => void,
) => {
  const columnResizeRef = useRef<string | undefined>();

  useEffect(() => {
    if (
      state.columnResizing &&
      !state.columnResizing?.isResizingColumn &&
      columnResizeRef.current
    ) {
      callback(
        columnResizeRef.current,
        state.columnResizing.columnWidths[columnResizeRef.current],
        state.columnResizing,
      );
    }
    columnResizeRef.current = state.columnResizing?.isResizingColumn;
  }, [callback, state.columnResizing]);
};
