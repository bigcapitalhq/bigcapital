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
