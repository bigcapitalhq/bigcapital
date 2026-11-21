export function getPaginationRowRange(
  currentPage: number,
  size: number,
  total: number,
) {
  // Keep the existing translation placeholders, but supply row numbers.
  return {
    currentPage: total === 0 ? 0 : (currentPage - 1) * size + 1,
    totalPages: Math.min(currentPage * size, total),
  };
}
