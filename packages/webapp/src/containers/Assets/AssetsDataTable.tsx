// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  DashboardContentTable,
  DataTable,
  TableSkeletonRows,
  TableSkeletonHeader,
} from '@/components';
import { useAssetsListContext } from './AssetsListProvider';
import { useMemorizedColumnsWidths } from '@/hooks';
import { TABLES } from '@/constants/tables';

/**
 * Assets data table columns.
 */
function useAssetsTableColumns() {
  return React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        width: 200,
      },
      {
        Header: 'Code',
        accessor: 'code',
        width: 100,
      },
      {
        Header: 'Purchase Price',
        accessor: 'purchasePrice',
        width: 120,
        Cell: ({ value }) => value?.toLocaleString(),
      },
      {
        Header: 'Book Value',
        accessor: 'bookValue',
        width: 120,
        Cell: ({ value }) => value?.toLocaleString(),
      },
      {
        Header: 'Status',
        accessor: 'status',
        width: 120,
      },
      {
        Header: 'Purchase Date',
        accessor: 'purchaseDate',
        width: 120,
      },
    ],
    [],
  );
}

/**
 * Assets data table.
 */
export function AssetsDataTable() {
  const history = useHistory();
  const { assets, pagination, isAssetsLoading, isAssetsFetching, setTableState } = useAssetsListContext();
  const columns = useAssetsTableColumns();

  const [initialColumnsWidths, , handleColumnResizing] = useMemorizedColumnsWidths(TABLES.ITEMS);

  const handleFetchData = React.useCallback(
    ({ pageSize, pageIndex, sortBy }) => {
      setTableState({ pageIndex, pageSize, sortBy });
    },
    [setTableState],
  );

  const handleCellClick = (cell) => {
    const assetId = cell.row.original.id;
    history.push(`/assets/${assetId}/edit`);
  };

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={assets}
        loading={isAssetsLoading}
        headerLoading={isAssetsLoading}
        progressBarLoading={isAssetsFetching}
        noInitialFetch={true}
        selectionColumn={true}
        manualSortBy={true}
        manualPagination={true}
        pagesCount={pagination?.pagesCount}
        pagination={true}
        autoResetSortBy={false}
        autoResetPage={true}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        onFetchData={handleFetchData}
        onCellClick={handleCellClick}
        initialColumnsWidths={initialColumnsWidths}
        onColumnResizing={handleColumnResizing}
        sticky={true}
      />
    </DashboardContentTable>
  );
}
