import React, { useCallback, useContext } from 'react';
import { If, Pagination } from 'components';
import TableContext from './TableContext';

/**
 * Table pagination.
 */
export default function TablePagination({}) {
  const {
    table: {
      gotoPage,
      setPageSize,
      pageCount,
      state: { pageIndex, pageSize },
    },
    props: { pagination, loading },
  } = useContext(TableContext);

  const handlePageChange = useCallback(
    (currentPage) => {
      gotoPage(currentPage - 1);
    },
    [gotoPage],
  );

  const handlePageSizeChange = useCallback(
    (pageSize, currentPage) => {
      gotoPage(0);
      setPageSize(pageSize);
    },
    [gotoPage, setPageSize],
  );

  return (
    <If condition={pagination && !loading}>
      <Pagination
        initialPage={pageIndex + 1}
        total={pageSize * pageCount}
        size={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </If>
  );
}
