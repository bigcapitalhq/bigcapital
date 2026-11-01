export type PaginatedPage = {
  pagination: {
    total: number;
    page: number;
    pageSize?: number;
    page_size?: number;
  };
};

export const getNextPageFromPagination = (
  page: PaginatedPage,
): number | undefined => {
  const { total, page: current, pageSize, page_size } = page.pagination;
  const size = pageSize ?? page_size ?? 0;
  return size > 0 && total > size * current ? current + 1 : undefined;
};

export const getPrevPageFromPagination = (
  page: PaginatedPage,
): number | undefined =>
  page.pagination.page > 1 ? page.pagination.page - 1 : undefined;
