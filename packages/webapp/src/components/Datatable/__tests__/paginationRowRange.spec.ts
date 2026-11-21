import { getPaginationRowRange } from '../paginationRowRange';

describe('getPaginationRowRange', () => {
  it.each([
    ['empty results', 1, 20, 0, 0, 0],
    ['empty results with the reducer page of zero', 0, 20, 0, 0, 0],
    ['first page', 1, 20, 61, 1, 20],
    ['middle page', 2, 20, 61, 21, 40],
    ['full last page', 3, 20, 60, 41, 60],
    ['partial last page', 4, 20, 61, 61, 61],
    ['partial single page', 1, 20, 7, 1, 7],
    ['different page size', 2, 30, 61, 31, 60],
  ])('%s', (_description, page, size, total, firstRow, lastRow) => {
    expect(getPaginationRowRange(page, size, total)).toEqual({
      currentPage: firstRow,
      totalPages: lastRow,
    });
  });
});
