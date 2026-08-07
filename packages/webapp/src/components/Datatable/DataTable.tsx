// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import {
  useTable,
  useExpanded,
  useRowSelect,
  usePagination,
  useResizeColumns,
  useSortBy,
  useFlexLayout,
  useAsyncDebounce,
} from 'react-table';
import { useSticky } from 'react-table-sticky';

import '@/style/components/DataTable/DataTable.scss';

import TableCell from './TableCell';
import TableContext from './TableContext';
import TableFooter from './TableFooter';
import TableHeader from './TableHeader';
import TableIndeterminateCheckboxHeader from './TableIndeterminateCheckboxHeader';
import TableIndeterminateCheckboxRow from './TableIndeterminateCheckboxRow';
import TableLoadingRow from './TableLoading';
import TableNoResultsRow from './TableNoResultsRow';
import TablePage from './TablePage';
import TablePagination from './TablePagination';
import TableRow from './TableRow';
import TableRows from './TableRows';
import TableTBody from './TableTBody';
import TableWrapper from './TableWrapper';
import { useResizeObserver } from './utils';
import { useUpdateEffect } from '@/hooks';
import { saveInvoke } from '@/utils';

/**
 * Datatable component.
 */
export function DataTable(props) {
  const {
    columns,
    data,

    onFetchData,

    onSelectedRowsChange,
    manualSortBy = false,
    manualPagination = true,
    selectionColumn = false,
    expandSubRows = true,
    expanded = {},
    rowClassNames,
    payload,
    expandable = false,
    noInitialFetch = false,

    rowsCount,

    // Pagination props.
    initialPageIndex = 0,
    initialPageSize = 20,

    // Hidden columns.
    initialHiddenColumns = [],

    updateDebounceTime = 200,
    selectionColumnWidth = 42,

    autoResetPage,
    autoResetExpanded,
    autoResetGroupBy,
    autoResetSelectedRows,
    autoResetSortBy,
    autoResetFilters,
    autoResetRowState,

    // Components
    TableHeaderRenderer,
    TablePageRenderer,
    TableWrapperRenderer,
    TableTBodyRenderer,
    TablePaginationRenderer,
    TableFooterRenderer,

    onColumnResizing,
    initialColumnsWidths,

    ...restProps
  } = props;

  const selectionColumnObj = {
    id: 'selection',
    disableResizing: true,
    minWidth: selectionColumnWidth,
    width: selectionColumnWidth,
    maxWidth: selectionColumnWidth,
    skeletonWidthMin: 100,
    // The header can use the table's getToggleAllRowsSelectedProps method
    // to render a checkbox
    Header: TableIndeterminateCheckboxHeader,
    // The cell can use the individual row's getToggleRowSelectedProps method
    // to the render a checkbox
    Cell: TableIndeterminateCheckboxRow,
    className: 'selection',
    ...(typeof selectionColumn === 'object' ? selectionColumn : {}),
  };

  const table = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: initialPageIndex,
        pageSize: initialPageSize,
        expanded,
        columnResizing: {
          columnWidths: initialColumnsWidths || {},
        },
        hiddenColumns: initialHiddenColumns,
      },
      manualPagination,
      pageCount:
        rowsCount && initialPageSize > 0
          ? Math.ceil(rowsCount / initialPageSize)
          : 0,
      getSubRows: (row) => row.children,
      manualSortBy,
      expandSubRows,
      payload,

      autoResetPage,
      autoResetExpanded,
      autoResetGroupBy,
      autoResetSelectedRows,
      autoResetSortBy,
      autoResetFilters,
      autoResetRowState,

      ...restProps,
    },
    useSortBy,
    useExpanded,
    useResizeColumns,
    useFlexLayout,
    useSticky,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        ...(selectionColumn ? [selectionColumnObj] : []),
        ...columns,
      ]);
    },
  );

  const {
    selectedFlatRows,
    state: { pageIndex, pageSize, sortBy, selectedRowIds },
  } = table;

  const isInitialMount = useRef(noInitialFetch);

  const onFetchDataDebounced = useAsyncDebounce((...args) => {
    saveInvoke(onFetchData, ...args);
  }, updateDebounceTime);

  // When these table states change, fetch new data!
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      onFetchDataDebounced({ pageIndex, pageSize, sortBy });
    }
  }, [pageIndex, pageSize, sortBy, onFetchDataDebounced]);

  useUpdateEffect(() => {
    saveInvoke(onSelectedRowsChange, selectedFlatRows);
  }, [selectedRowIds, onSelectedRowsChange]);

  // Column resizing observer.
  useResizeObserver(table.state, (current, columnWidth, columnsResizing) => {
    onColumnResizing && onColumnResizing(current, columnWidth, columnsResizing);
  });

  return (
    <TableContext.Provider value={{ table, props }}>
      <TableWrapperRenderer>
        <TableHeaderRenderer />

        <TableTBodyRenderer>
          <TablePageRenderer />
        </TableTBodyRenderer>

        <TableFooterRenderer />
      </TableWrapperRenderer>

      <TablePaginationRenderer />
    </TableContext.Provider>
  );
}

DataTable.defaultProps = {
  pagination: false,
  hidePaginationNoPages: true,
  hideTableHeader: false,

  size: null,
  spinnerProps: { size: 30 },

  expandToggleColumn: 1,
  expandColumnSpace: 0.8,

  autoResetPage: true,
  autoResetExpanded: true,
  autoResetGroupBy: true,
  autoResetSelectedRows: true,
  autoResetSortBy: true,
  autoResetFilters: true,
  autoResetRowState: true,

  TableHeaderRenderer: TableHeader,
  TableFooterRenderer: TableFooter,
  TableLoadingRenderer: TableLoadingRow,
  TablePageRenderer: TablePage,
  TableRowsRenderer: TableRows,
  TableRowRenderer: TableRow,
  TableCellRenderer: TableCell,
  TableWrapperRenderer: TableWrapper,
  TableTBodyRenderer: TableTBody,
  TablePaginationRenderer: TablePagination,
  TableNoResultsRowRenderer: TableNoResultsRow,

  noResults: '',
  payload: {},
};
