import {
  BP_Table,
  withPagination,
} from '@bigcapitalhq/blueprintjs-react-table';
import { functionalUpdate } from '@tanstack/react-table';
import { noop } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import '@bigcapitalhq/blueprintjs-react-table/styles.css';
import type { TableQuery } from '@/store/store.types';
import type {
  BP_BodyElementProps,
  BP_PaginatedTableProps,
} from '@bigcapitalhq/blueprintjs-react-table';
import {
  DashboardContentTable,
  EmptyStatus,
  MaterialProgressBar,
} from '@/components';
import {
  getDashboardTableProps,
  getRowId,
  onCellDetailClick,
  TABLE_LOADING_OPTIONS,
  useTableRowSelection,
} from '@/components/Datatable/blueprintTable';
import { useMemorizedColumnsWidths } from '@/hooks';

const PAGE_SIZE_OPTIONS = [20, 30, 50, 75, 100, 150];
const PAGINATION_BUTTON_PROPS = { small: true };
const EMPTY_SELECTED_IDS: number[] = [];

interface DashboardListTableConfig<TRecord, TActions> {
  tableName: string;
  rowName: string;
  identifierColumn: string;
  ActionsMenu: React.ComponentType<{
    row: { original: TRecord };
    payload: TActions;
  }>;
}

type DashboardListTableSelectionProps =
  | { selectedIds: number[]; setSelectedIds: (ids: number[]) => void }
  | { selectedIds?: never; setSelectedIds?: never };

type DashboardListTableProps<TRecord extends { id: number }, TActions> = {
  columns: BP_PaginatedTableProps<TRecord>['columns'];
  data: TRecord[] | undefined;
  /** An unknown total keeps the current page while its request is in flight. */
  total: number | undefined;
  loading: boolean;
  fetching: boolean;
  emptyMessage?: string;
  compact: boolean;
  query: Partial<TableQuery>;
  setQuery: (query: Partial<TableQuery>) => void;
  actions: TActions;
} & DashboardListTableSelectionProps;

export function createDashboardListTable<
  TRecord extends { id: number },
  TActions extends { onViewDetails: (record: TRecord) => void },
>({
  tableName,
  rowName,
  identifierColumn,
  ActionsMenu,
}: DashboardListTableConfig<TRecord, TActions>) {
  type TableProps = BP_PaginatedTableProps<TRecord>;
  const PaginatedTable = withPagination<TRecord>(BP_Table);
  const rowIdAttribute = `data-${rowName}-id` as const;
  const emptyRows: TRecord[] = [];

  return function DashboardListTable({
    columns,
    data = emptyRows,
    total,
    loading,
    fetching,
    emptyMessage,
    compact,
    query,
    setQuery,
    selectedIds,
    setSelectedIds,
    actions,
  }: DashboardListTableProps<TRecord, TActions>) {
    const [columnSizing, setColumnSizing] =
      useMemorizedColumnsWidths(tableName);
    const { rowSelection, onRowSelectionChange } = useTableRowSelection(
      selectedIds ?? EMPTY_SELECTED_IDS,
      setSelectedIds ?? noop,
    );
    const pagination = {
      pageIndex: query.pageIndex ?? 0,
      pageSize: query.pageSize ?? 20,
    };
    const sorting = query.sortBy ?? [];
    const state = { columnSizing, pagination, sorting };
    const loadingOptions = loading ? TABLE_LOADING_OPTIONS : undefined;
    const hasRows = data.length > 0;

    const onSortingChange: TableProps['onSortingChange'] = (update) => {
      setQuery({ sortBy: functionalUpdate(update, sorting) });
    };
    const onPaginationChange: TableProps['onPaginationChange'] = (update) => {
      setQuery(functionalUpdate(update, pagination));
    };
    const getCellProps: TableProps['getCellProps'] = ({ row, column }) => {
      const props: BP_BodyElementProps = {
        'data-testId':
          column.id === identifierColumn ? `${rowName}-row` : undefined,
        onClick: onCellDetailClick(() => actions.onViewDetails(row.original)),
      };
      props[rowIdAttribute] = row.original.id;
      return props;
    };
    const bodyContextMenuRenderer: TableProps['bodyContextMenuRenderer'] = (
      context,
    ) => {
      const row = context.getTargetRow();
      return row && <ActionsMenu row={row} payload={actions} />;
    };

    return (
      <DashboardContentTable>
        {fetching && !loading && <MaterialProgressBar />}
        <PaginatedTable
          columns={columns}
          data={data}
          getRowId={getRowId}
          enableRowHeader={false}
          {...getDashboardTableProps(compact)}
          enableSorting
          manualSorting
          onSortingChange={onSortingChange}
          manualPagination
          autoResetPageIndex={false}
          rowCount={total}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          paginationWithEdges={false}
          paginationButtonProps={PAGINATION_BUTTON_PROPS}
          pageSizeButtonProps={PAGINATION_BUTTON_PROPS}
          showPaginationBar={hasRows || pagination.pageIndex > 0}
          onPaginationChange={onPaginationChange}
          state={state}
          onColumnSizingChange={setColumnSizing}
          showRowSelectionCheckboxes={selectedIds !== undefined}
          rowSelection={rowSelection}
          onRowSelectionChange={onRowSelectionChange}
          getCellProps={getCellProps}
          bodyContextMenuRenderer={bodyContextMenuRenderer}
          enableBodyContextMenu={!fetching}
          enableGhostCells
          loadingOptions={loadingOptions}
        />
        {!loading && !hasRows && (
          <EmptyStatus
            title={emptyMessage ?? intl.get('there_is_no_results_in_the_table')}
          />
        )}
      </DashboardContentTable>
    );
  };
}
