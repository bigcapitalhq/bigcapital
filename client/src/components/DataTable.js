import React, { useEffect, useRef, useCallback } from 'react';
import {
  useTable,
  useExpanded,
  useRowSelect,
  usePagination,
  useResizeColumns,
  useSortBy,
  useFlexLayout,
} from 'react-table';
import {
  Checkbox,
  Spinner,
  ContextMenu,
  Menu,
  MenuItem,
} from '@blueprintjs/core';
import classnames from 'classnames';
import { FixedSizeList } from 'react-window';
import { useSticky } from 'react-table-sticky';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';

import { ConditionalWrapper } from 'utils';
import { useUpdateEffect } from 'hooks';
import { If, Pagination } from 'components';

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    return <Checkbox indeterminate={indeterminate} {...rest} />;
  },
);

export default function DataTable({
  columns,
  data,
  loading,
  onFetchData,
  onSelectedRowsChange,
  manualSortBy = false,
  selectionColumn = false,
  expandSubRows = true,
  className,
  noResults = 'This report does not contain any data.',
  expanded = {},
  rowClassNames,
  sticky = false,
  virtualizedRows = false,
  fixedSizeHeight = 100,
  fixedItemSize = 30,
  payload,
  expandable = false,
  expandToggleColumn = 2,
  noInitialFetch = false,
  spinnerProps = { size: 30 },

  pagination = false,
  pagesCount: controlledPageCount,
  initialPageIndex,
  initialPageSize,
  rowContextMenu,

  expandColumnSpace = 1.5,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    rows,
    selectedFlatRows,
    getToggleAllRowsExpandedProps,
    isAllRowsExpanded,
    totalColumnsWidth,

    // page,
    pageCount,
    canPreviousPage,
    canNextPage,
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,

    // Get the state from the instance
    state: { pageIndex, pageSize, sortBy, selectedRowIds },
  } = useTable(
    {
      columns,
      data: data,
      initialState: {
        pageIndex: initialPageIndex,
        pageSize: initialPageSize,
        expanded,
      }, // Pass our hoisted table state
      manualPagination: true,
      pageCount: controlledPageCount,
      getSubRows: (row) => row.children,
      manualSortBy,
      expandSubRows,
      payload,
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
        ...(selectionColumn
          ? [
              {
                id: 'selection',
                disableResizing: true,
                minWidth: 42,
                width: 42,
                maxWidth: 42,
                // The header can use the table's getToggleAllRowsSelectedProps method
                // to render a checkbox
                Header: ({ getToggleAllRowsSelectedProps }) => (
                  <div>
                    <IndeterminateCheckbox
                      {...getToggleAllRowsSelectedProps()}
                    />
                  </div>
                ),
                // The cell can use the individual row's getToggleRowSelectedProps method
                // to the render a checkbox
                Cell: ({ row }) => (
                  <div>
                    <IndeterminateCheckbox
                      {...row.getToggleRowSelectedProps()}
                    />
                  </div>
                ),
                className: 'selection',
                ...(typeof selectionColumn === 'object' ? selectionColumn : {}),
              },
            ]
          : []),
        ...columns,
      ]);
    },
  );

  const isInitialMount = useRef(noInitialFetch);

  // When these table states change, fetch new data!
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      onFetchData && onFetchData({ pageIndex, pageSize, sortBy });
    }
  }, [pageIndex, pageSize, manualSortBy ? sortBy : null, onFetchData]);

  useUpdateEffect(() => {
    onSelectedRowsChange && onSelectedRowsChange(selectedFlatRows);
  }, [selectedRowIds, onSelectedRowsChange]);

  // Renders table cell.
  const RenderCell = useCallback(
    ({ row, cell, index }) => (
      <ConditionalWrapper
        condition={expandToggleColumn === index && expandable}
        wrapper={(children) => (
          <div
            style={{
              'padding-left': `${row.depth * expandColumnSpace}rem`,
            }}
          >
            {children}
          </div>
        )}
      >
        {
          // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
          // to build the toggle for expanding a row
          row.canExpand && expandable && index === expandToggleColumn && (
            <span
              {...row.getToggleRowExpandedProps({
                className: 'expand-toggle',
              })}
            >
              <span
                className={classnames({
                  'arrow-down': row.isExpanded,
                  'arrow-right': !row.isExpanded,
                })}
              />
            </span>
          )
        }
        {cell.render('Cell')}
      </ConditionalWrapper>
    ),
    [expandable, expandToggleColumn],
  );

  const handleRowContextMenu = (cell, row) => (e) => {
    if (typeof rowContextMenu === 'function') {
      e.preventDefault();
      const tr = e.currentTarget.closest('.tr');
      tr.classList.add('is-context-menu-active');

      const DropdownEl = rowContextMenu(cell, row);

      ContextMenu.show(DropdownEl, { left: e.clientX, top: e.clientY }, () => {
        tr.classList.remove('is-context-menu-active');
      });
    }
  };

  // Renders table row.
  const RenderRow = useCallback(
    ({ style = {}, row }) => {
      prepareRow(row);
      const rowClasses = rowClassNames && rowClassNames(row);

      return (
        <div
          {...row.getRowProps({
            className: classnames('tr', {
              'is-expanded': row.isExpanded && row.canExpand,
            }, rowClasses),
            style,
          })}
        >
          {row.cells.map((cell, i) => {
            const index = i + 1;
            return (
              <div
                {...cell.getCellProps({
                  className: classnames(cell.column.className || '', 'td'),
                })}
                onContextMenu={handleRowContextMenu(cell, row)}
              >
                {RenderCell({ cell, row, index })}
              </div>
            );
          })}
        </div>
      );
    },
    [prepareRow, rowClassNames, expandable, RenderCell, expandToggleColumn],
  );

  // Renders virtualize circle table rows.
  const RenderVirtualizedRows = useCallback(
    ({ index, style }) => {
      const row = rows[index];
      return RenderRow({ row, style });
    },
    [RenderRow, rows],
  );

  const RenderPage = useCallback(
    ({ style, index } = {}) => {
      return page.map((row, index) => RenderRow({ row }));
    },
    [RenderRow, page],
  );

  // Renders fixed size tbody.
  const RenderTBody = useCallback(() => {
    return virtualizedRows ? (
      <FixedSizeList
        height={fixedSizeHeight}
        itemCount={rows.length}
        itemSize={fixedItemSize}
      >
        {RenderVirtualizedRows}
      </FixedSizeList>
    ) : (
      RenderPage()
    );
  }, [
    fixedSizeHeight,
    rows,
    fixedItemSize,
    virtualizedRows,
    RenderVirtualizedRows,
    RenderPage,
  ]);

  return (
    <div
      className={classnames('bigcapital-datatable', className, {
        'has-sticky': sticky,
        'is-expandable': expandable,
        'is-loading': loading,
        'has-virtualized-rows': virtualizedRows,
      })}
    >
      <ScrollSync>
        <div
          {...getTableProps({ style: { minWidth: 'none' } })}
          className="table"
        >
          <ScrollSyncPane>
            <div className="thead">
              {headerGroups.map((headerGroup) => (
                <div {...headerGroup.getHeaderGroupProps()} className="tr">
                  {headerGroup.headers.map((column, index) => (
                    <div
                      {...column.getHeaderProps({
                        className: classnames(column.className || '', 'th'),
                      })}
                    >
                      {expandable && index + 1 === expandToggleColumn && (
                        <span
                          {...getToggleAllRowsExpandedProps()}
                          className="expand-toggle"
                        >
                          <span
                            className={classnames({
                              'arrow-down': isAllRowsExpanded,
                              'arrow-right': !isAllRowsExpanded,
                            })}
                          />
                        </span>
                      )}

                      <div {...column.getSortByToggleProps()}>
                        {column.render('Header')}

                        {column.isSorted && (
                          <span
                            className={classnames(
                              {
                                'sort-icon--desc': column.isSortedDesc,
                                'sort-icon--asc': !column.isSortedDesc,
                              },
                              'sort-icon',
                            )}
                          ></span>
                        )}
                      </div>

                      {column.canResize && (
                        <div
                          {...column.getResizerProps()}
                          className={`resizer ${
                            column.isResizing ? 'isResizing' : ''
                          }`}
                        >
                          <div class="inner-resizer" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </ScrollSyncPane>

          <ScrollSyncPane>
            <div {...getTableBodyProps()} className="tbody">
              <div class="tbody-inner" style={{ minWidth: totalColumnsWidth }}>
                <If condition={!loading}>{RenderTBody()}</If>

                <If condition={!loading && page.length === 0}>
                  <div className={'tr no-results'}>
                    <div class="td">{noResults}</div>
                  </div>
                </If>
              </div>

              <If condition={loading}>
                <div class="loading">
                  <Spinner size={spinnerProps.size} />
                </div>
              </If>
            </div>
          </ScrollSyncPane>
        </div>
      </ScrollSync>

      <If condition={pagination && pageCount && !loading}>
        <Pagination
          initialPage={pageIndex + 1}
          total={pageSize * pageCount}
          size={pageSize}
          onPageChange={(currentPage) => {
            gotoPage(currentPage - 1);
          }}
          onPageSizeChange={(pageSize, currentPage) => {
            gotoPage(currentPage - 1);
            setPageSize(pageSize);
          }}
        />
      </If>
    </div>
  );
}
