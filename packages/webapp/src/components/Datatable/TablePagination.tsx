import { useCallback, useContext } from 'react';
import TableContext from './TableContext';
import { Pagination } from '@/components';
import { saveInvoke } from '@/utils';

interface PaginationChangePayload {
  page: number;
  pageSize: number;
}

export default function TablePagination() {
  const {
    table: {
      gotoPage,
      setPageSize,
      pageCount,
      state: { pageIndex, pageSize },
    },
    props: {
      pagination,
      loading,
      onPaginationChange,
      hidePaginationNoPages,
      rowsCount,
    },
  } = useContext(TableContext);

  const triggerOnPaginationChange = useCallback(
    (payload: { pageIndex: number; pageSize: number }) => {
      saveInvoke(onPaginationChange, payload);
    },
    [onPaginationChange],
  );

  const handlePageChange = useCallback(
    ({ page, pageSize }: PaginationChangePayload) => {
      const newPageIndex = page - 1;

      gotoPage(newPageIndex);
      triggerOnPaginationChange({ pageIndex: newPageIndex, pageSize });
    },
    [gotoPage, triggerOnPaginationChange],
  );

  const handlePageSizeChange = useCallback(
    ({ pageSize }: PaginationChangePayload) => {
      const newPageIndex = 0;

      gotoPage(newPageIndex);
      setPageSize(pageSize);

      triggerOnPaginationChange({ pageIndex: newPageIndex, pageSize });
    },
    [gotoPage, setPageSize, triggerOnPaginationChange],
  );

  const showPagination =
    !!pagination &&
    ((hidePaginationNoPages && pageCount > 1) || !hidePaginationNoPages) &&
    !loading;

  if (!showPagination) {
    return null;
  }

  return (
    <Pagination
      currentPage={pageIndex + 1}
      total={rowsCount ?? pageSize * pageCount}
      size={pageSize}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  );
}
