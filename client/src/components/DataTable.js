import React, {useEffect, useMemo, useCallback} from 'react';
import {
  useTable,
  useExpanded,
  useRowSelect,
  usePagination,
  useResizeColumns,
  useAsyncDebounce,
  useSortBy,
  useFlexLayout
} from 'react-table'
import {Checkbox} from '@blueprintjs/core';
import classnames from 'classnames';
import { FixedSizeList } from 'react-window'
import { ConditionalWrapper } from 'utils';

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    return (<Checkbox indeterminate={indeterminate} {...rest} />);
  }
);

export default function DataTable({
  columns,
  data,
  loading,
  onFetchData,
  onSelectedRowsChange,
  manualSortBy = 'false',
  selectionColumn = false,
  expandSubRows = true,
  className,
  noResults = 'This report does not contain any data.',
  expanded = {},
  rowClassNames,
  stickyHeader = true,
  virtualizedRows = false,
  fixedSizeHeight = 100,
  fixedItemSize = 30,
  payload, 
  expandable = false,
  expandToggleColumn = 2,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    rows,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    totalColumnsWidth,
    getToggleAllRowsExpandedProps,
    isAllRowsExpanded,

    // Get the state from the instance
    state: { pageIndex, pageSize, sortBy, selectedRowIds },
  } = useTable(
    {
      columns,
      data: data,
      initialState: { pageIndex: 0, expanded }, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      // pageCount: controlledPageCount,
      getSubRows: row => row.children,
      manualSortBy,
      expandSubRows,
      payload,
    },
    useSortBy,
    useExpanded,
    useRowSelect,
    usePagination,
    useResizeColumns,
    useFlexLayout,
    hooks => {
      hooks.visibleColumns.push(columns => [
        // Let's make a column for selection
        ...(selectionColumn) ? [{
          id: 'selection',
          disableResizing: true,
          minWidth: 35,
          width: 35,
          maxWidth: 35,
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
          className: 'selection',
          ...(typeof selectionColumn === 'object') ? selectionColumn : {},
        }] : [],
        ...columns,
      ])
    }
  );
 
  // When these table states change, fetch new data!
  useEffect(() => {
    onFetchData && onFetchData({ pageIndex, pageSize, sortBy })
  }, [pageIndex, pageSize, sortBy]);

  // Renders table cell.
  const RenderCell = useCallback(({ row, cell, index }) => (
    <ConditionalWrapper
      condition={expandToggleColumn === index && expandable}
      wrapper={(children) => (<div style={{  
        'padding-left': `${row.depth * 1.5}rem`,
      }}>{children}</div>)}
    >
      {
        // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
        // to build the toggle for expanding a row
        (row.canExpand && expandable && index === expandToggleColumn) && (
          <span {...row.getToggleRowExpandedProps({       
            className: 'expand-toggle',
          })}>
            <span className={classnames({
              'arrow-down': row.isExpanded,
              'arrow-right': !row.isExpanded,
            })} />
          </span>
        )
      }
      { cell.render('Cell') }
    </ConditionalWrapper>
  ), [expandable, expandToggleColumn]);

  // Renders table row.
  const RenderRow = useCallback(({ style = {}, row }) => {
    prepareRow(row);    
    const rowClasses = rowClassNames && rowClassNames(row);

    return (
      <div {...row.getRowProps({
        className: classnames('tr', rowClasses), style
      })}>
        {row.cells.map((cell, i) => {
          const index = i + 1;
          return <div {...cell.getCellProps({
            className: classnames(cell.column.className || '', 'td'),
          })}>
            { RenderCell({ cell, row, index }) }
          </div>
        })}
      </div>);
  }, [prepareRow, rowClassNames, expandable, RenderCell, expandToggleColumn]);

  // Renders virtualize circle table rows.
  const RenderVirtualizedRows = useCallback(({ index, style }) => {
    const row = rows[index];
    return RenderRow({ row, style });
  }, [RenderRow, rows]);

  const RenderPage = useCallback(({ style, index } = {}) => {
    return page.map((row, index) => RenderRow({ row }));
  }, [RenderRow, page]);

  // Renders fixed size tbody.
  const RenderTBody = useCallback(() => {
    return (virtualizedRows) ? (
      <FixedSizeList
        height={fixedSizeHeight}
        itemCount={rows.length}
        itemSize={fixedItemSize}
      >
        {RenderVirtualizedRows}
      </FixedSizeList>
    ) : RenderPage();
  }, [fixedSizeHeight, rows, fixedItemSize, virtualizedRows, RenderVirtualizedRows, RenderPage]);

  return (
    <div className={classnames(
      'bigcapital-datatable',
      className,
      {'has-sticky-header': stickyHeader, 'is-expandable': expandable})}>
      <div {...getTableProps()} className="table"> 
        <div className="thead">
          {headerGroups.map(headerGroup => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr">
              {headerGroup.headers.map((column, index) => (
                <div {...column.getHeaderProps({
                  className: classnames(column.className || '', 'th'),
                })}>
                  {(expandable && (index + 1) === expandToggleColumn) && (
                    <span
                      {...getToggleAllRowsExpandedProps()}
                      className="expand-toggle">
                      <span className={classnames({
                        'arrow-down': isAllRowsExpanded,
                        'arrow-right': !isAllRowsExpanded,
                      })} />
                    </span>)}

                  <div {...column.getSortByToggleProps()}>
                    {column.render('Header')}

                    {column.isSorted && (
                      <span className={classnames({
                        'sort-icon--desc': column.isSortedDesc,
                        'sort-icon--asc': !column.isSortedDesc,
                      }, 'sort-icon')}>
                      </span>
                    )}
                  </div>

                  {column.canResize && (
                    <div
                      {...column.getResizerProps()}
                      className={`resizer ${
                        column.isResizing ? 'isResizing' : ''
                      }`}>
                      <div class="inner-resizer" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div {...getTableBodyProps()} className="tbody">
          { RenderTBody() }
        
          { (page.length === 0) && (
            <div className={'tr no-results'}>
              <div class="td">{ noResults }</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}