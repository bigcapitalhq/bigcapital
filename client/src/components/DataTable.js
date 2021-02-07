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

import { useUpdateEffect } from 'hooks';
import { saveInvoke } from 'utils';

import 'style/components/DataTable/DataTable.scss';

import TableNoResultsRow from './Datatable/TableNoResultsRow';
import TableLoadingRow from './Datatable/TableLoading';
import TableHeader from './Datatable/TableHeader';
import TablePage from './Datatable/TablePage';
import TableRow from './Datatable/TableRow';
import TableRows from './Datatable/TableRows';
import TableCell from './Datatable/TableCell';
import TableTBody from './Datatable/TableTBody';
import TableContext from './Datatable/TableContext';
import TablePagination from './Datatable/TablePagination';
import TableWrapper from './Datatable/TableWrapper';

import TableIndeterminateCheckboxRow from './Datatable/TableIndeterminateCheckboxRow';
import TableIndeterminateCheckboxHeader from './Datatable/TableIndeterminateCheckboxHeader';

/**
 * Datatable component.
 */
export default function DataTable(props) {
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
    
    pagesCount: controlledPageCount,

    // Pagination props.
    initialPageIndex = 0,
    initialPageSize = 10,

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
      },
      manualPagination,
      pageCount: controlledPageCount,
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
    },
    useSortBy,
    useExpanded,
    useRowSelect,
    useResizeColumns,
    useFlexLayout,
    useSticky,
    usePagination,
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

  return (
    <TableContext.Provider value={{ table, props }}>
      <TableWrapperRenderer>
        <TableHeaderRenderer />

        <TableTBodyRenderer>
          <TablePageRenderer />
        </TableTBodyRenderer>
      </TableWrapperRenderer>

      <TablePaginationRenderer />
    </TableContext.Provider>
  );
}


DataTable.defaultProps = {
  pagination: false,
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
  TableLoadingRenderer: TableLoadingRow,
  TablePageRenderer: TablePage,
  TableRowsRenderer: TableRows,
  TableRowRenderer: TableRow,
  TableCellRenderer: TableCell,
  TableWrapperRenderer: TableWrapper,
  TableTBodyRenderer: TableTBody,
  TablePaginationRenderer: TablePagination,
  TableNoResultsRowRenderer: TableNoResultsRow,

  noResults: 'There is no results in the table.',
  payload: {},
};