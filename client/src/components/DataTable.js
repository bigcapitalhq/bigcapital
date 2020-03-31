import React, {useEffect} from 'react';
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
import Icon from 'components/Icon';

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (<Checkbox ref={resolvedRef} {...rest} />);
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
  className
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,

    // Get the state from the instance
    state: { pageIndex, pageSize, sortBy, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      // pageCount: controlledPageCount,
      getSubRows: row => row.children,
      manualSortBy
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
        }] : [],
        ...columns,
      ])
    }
  );

  // When these table states change, fetch new data!
  useEffect(() => {
    onFetchData && onFetchData({ pageIndex, pageSize, sortBy })
  }, [pageIndex, pageSize, sortBy]);

  return (
    <div className={classnames('bigcapital-datatable', className)}>
      <div {...getTableProps()} className="table"> 
        <div className="thead">
          {headerGroups.map(headerGroup => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr">
              {headerGroup.headers.map(column => (
                <div {...column.getHeaderProps({
                  className: classnames(column.className || '', 'th'),
                })}>
                  <div {...column.getSortByToggleProps()}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? (<Icon icon="sort-down" />)
                          : (<Icon icon="sort-up" />)
                        : ''}
                    </span>
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
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <div {...row.getRowProps()} className="tr">
                {row.cells.map((cell) => {
                  return <div {...cell.getCellProps({
                    className: classnames(cell.column.className || '', 'td'),
                  })}>{ cell.render('Cell') }</div>
                })}
              </div>)
          })}
        </div>
      </div>
    </div>
  )
}