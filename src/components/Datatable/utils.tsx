// @ts-nocheck
import React from 'react';

export const isCellLoading = (loading, cellsCoords, rowIndex, columnId) => {
  if (!loading) {
    return false;
  }
  return !cellsCoords
    ? true
    : cellsCoords.some(
        (cellCoord) => cellCoord[0] === rowIndex && cellCoord[1] === columnId,
      );
};

export const useResizeObserver = (state, callback) => {
  // This Ref will contain the id of the column being resized or undefined
  const columnResizeRef = React.useRef();

  React.useEffect(() => {
    // We are interested in calling the resize event only when "state.columnResizing?.isResizingColumn" changes from
    // a string to undefined, because it indicates that it WAS resizing but it no longer is.
    if (
      state.columnResizing &&
      !state.columnResizing?.isResizingColumn &&
      columnResizeRef.current
    ) {
      // Trigger resize event
      callback(
        columnResizeRef.current,
        state.columnResizing.columnWidths[columnResizeRef.current],
        state.columnResizing,
      );
    }
    columnResizeRef.current = state.columnResizing?.isResizingColumn;
  }, [callback, state.columnResizing]);
};
