export type Pagination = {
  total: number;
  page: number;
  pageSize?: number;
  page_size?: number;
};

export type PaginatedPage = {
  pagination: Pagination;
};

export const getNextPageFromPagination = (
  page?: { pagination?: Pagination | null } | null,
): number | undefined => {
  const pagination = page?.pagination;

  if (!pagination) {
    return undefined;
  }
  const { total, page: current, pageSize, page_size } = pagination;
  const size = pageSize ?? page_size ?? 0;
  return size > 0 && total > size * current ? current + 1 : undefined;
};

export const getPrevPageFromPagination = (
  page: PaginatedPage,
): number | undefined =>
  page.pagination.page > 1 ? page.pagination.page - 1 : undefined;
