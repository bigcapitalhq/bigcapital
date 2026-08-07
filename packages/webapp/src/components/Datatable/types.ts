import type { ComponentType, ReactNode } from 'react';
import type {
  Column,
  ColumnInstance,
  Row,
  TableInstance,
  TableState,
  UseExpandedInstanceProps,
  UseExpandedRowProps,
  UseExpandedState,
  UsePaginationInstanceProps,
  UsePaginationState,
  UseResizeColumnsColumnProps,
  UseRowSelectInstanceProps,
  UseRowSelectRowProps,
  UseRowSelectState,
  UseSortByColumnProps,
  UseSortByInstanceProps,
  UseSortByState,
} from 'react-table';

/**
 * Custom column meta that the DataTable ecosystem reads on top of
 * react-table's built-in column properties.
 */
export interface DataTableColumnMeta {
  className?: string;
  clickable?: boolean;
  money?: boolean;
  align?: string;
  textOverview?: boolean;
  skeletonWidthMin?: number;
  skeletonWidthMax?: number;
  forceWidthAccess?: string;
}

/**
 * Augment react-table's base types with (a) our custom column meta and
 * `payload` plumbing, and (b) the props contributed by every plugin hook
 * DataTable installs (sort / expand / paginate / row-select / resize).
 * DataTable always runs these plugins together, so merging them into the
 * base types lets every subcomponent read resolved fields like
 * `cell.column.isSorted`, `row.canExpand`, `table.page`, etc. directly.
 *
 * `getToggleAllRowsExpandedProps` is exposed as a function at runtime but
 * @types/react-table types it as an array on UseExpandedHooks — declare it
 * as a callable on the instance so TableHeader can spread it.
 */
declare module 'react-table' {
  interface ColumnInterface<D> extends DataTableColumnMeta {}
  interface ColumnInstance<D>
    extends DataTableColumnMeta,
      UseSortByColumnProps<D>,
      UseResizeColumnsColumnProps<D> {}
  interface Row<D> extends UseExpandedRowProps<D>, UseRowSelectRowProps<D> {}
  interface TableInstance<D>
    extends UseSortByInstanceProps<D>,
      UseExpandedInstanceProps<D>,
      UsePaginationInstanceProps<D>,
      UseRowSelectInstanceProps<D> {
    payload?: Record<string, any>;
    getToggleAllRowsExpandedProps: () => Record<string, any>;
  }
  interface TableState<D>
    extends UseSortByState<D>,
      UseExpandedState<D>,
      UsePaginationState<D>,
      UseRowSelectState<D> {
    columnResizing?: {
      isResizingColumn?: string;
      columnWidths: Record<string, number>;
      startX?: number;
      columnWidth?: number;
      headerIdWidths?: Record<string, number>;
    };
  }
  interface TableOptions<D> {
    payload?: Record<string, any>;
    expandSubRows?: boolean;
    manualSortBy?: boolean;
    manualPagination?: boolean;
    pageCount?: number;
    getSubRows?: (row: D, relativeIndex: number) => D[] | undefined;
    autoResetPage?: boolean;
    autoResetExpanded?: boolean;
    autoResetGroupBy?: boolean;
    autoResetSelectedRows?: boolean;
    autoResetSortBy?: boolean;
    autoResetFilters?: boolean;
    autoResetRowState?: boolean;
  }
}

/**
 * Column definition accepted by DataTable — a react-table Column
 * extended with the custom meta consumed by cells/header/skeletons.
 */
export type DataTableColumn<D extends object = any> = Column<D> &
  DataTableColumnMeta;

/**
 * Props that the row-level ContextMenu / ActionsMenu implementation receives.
 * TableRow renders `<ContextMenuContent {...table} row={row} />`.
 */
export interface DataTableContextMenuProps<D extends object = any> {
  row: Row<D>;
  payload?: Record<string, any>;
  [key: string]: any;
}

export type Renderer<P = any> = ComponentType<P>;

export interface DataTableProps<D extends object = any> {
  // Columns are loosely typed at the DataTable boundary so legacy tables
  // (financial statements, drawers) keep compiling. List pages type their
  // columns at the source via `DataTableColumn<RowType>` returned from
  // their `useXxxTableColumns()` hooks.
  columns: any[];
  data: D[];

  onFetchData?: (params: {
    pageIndex: number;
    pageSize: number;
    sortBy: Array<{ id: string; desc: boolean }>;
  }) => void;
  onSelectedRowsChange?: (selectedFlatRows: Row<D>[]) => void;
  onColumnResizing?: (
    currentColumnId: string,
    columnWidth: number,
    columnResizing: TableState<D>['columnResizing'],
  ) => void;
  onCellClick?: (cell: any, event: React.MouseEvent) => void;
  onPaginationChange?: (payload: {
    pageIndex: number;
    pageSize: number;
  }) => void;

  manualSortBy?: boolean;
  manualPagination?: boolean;
  selectionColumn?: boolean | Partial<DataTableColumn<D>>;
  expandSubRows?: boolean;
  expanded?: any;
  rowClassNames?: (row: Row<D>) => string | undefined;
  payload?: Record<string, any>;
  expandable?: boolean;
  noInitialFetch?: boolean;
  rowsCount?: number;
  cellsLoading?: boolean;
  cellsLoadingCoords?: Array<[number, string]>;

  initialPageIndex?: number;
  initialPageSize?: number;
  initialHiddenColumns?: string[];
  updateDebounceTime?: number;
  selectionColumnWidth?: number;

  autoResetPage?: boolean;
  autoResetExpanded?: boolean;
  autoResetGroupBy?: boolean;
  autoResetSelectedRows?: boolean;
  autoResetSortBy?: boolean;
  autoResetFilters?: boolean;
  autoResetRowState?: boolean;

  sticky?: boolean;
  pagination?: boolean;
  loading?: boolean;
  headerLoading?: boolean;
  progressBarLoading?: boolean;
  hidePaginationNoPages?: boolean;
  hideTableHeader?: boolean;
  virtualizedRows?: boolean;
  footer?: boolean;
  size?: string | null;
  styleName?: string;
  className?: string;
  spinnerProps?: Record<string, any>;
  noResults?: ReactNode;
  expandToggleColumn?: number;
  expandColumnSpace?: number;
  initialColumnsWidths?: Record<string, number>;
  vListrowHeight?: number;
  vListOverscanRowCount?: number;
  windowScrollerProps?: { scrollElement?: HTMLElement };

  ContextMenu?: Renderer<DataTableContextMenuProps<D>>;

  TableHeaderRenderer?: Renderer;
  TablePageRenderer?: Renderer;
  TableWrapperRenderer?: Renderer<{ children?: ReactNode }>;
  TableTBodyRenderer?: Renderer<{ children?: ReactNode }>;
  TablePaginationRenderer?: Renderer;
  TableFooterRenderer?: Renderer;
  TableLoadingRenderer?: Renderer<{ spinnerProps?: Record<string, any> }>;
  TableRowsRenderer?: Renderer;
  TableRowRenderer?: Renderer<{
    row: Row<D>;
    index?: number;
    className?: string;
    style?: React.CSSProperties;
    TableCellRenderer?: Renderer<any>;
  }>;
  TableCellRenderer?: Renderer<{
    cell: any;
    row: Row<D>;
    index?: number;
  }>;
  TableNoResultsRowRenderer?: Renderer;
  TableHeaderSkeletonRenderer?: Renderer;
}

/**
 * The props shape as seen inside TableContext. DataTable resolves all
 * renderer slots to their defaults before publishing the context, so
 * subcomponents can treat them as required and use them directly as JSX.
 */
export type ResolvedDataTableProps<D extends object = any> = Omit<
  DataTableProps<D>,
  | 'TableHeaderRenderer'
  | 'TablePageRenderer'
  | 'TableWrapperRenderer'
  | 'TableTBodyRenderer'
  | 'TablePaginationRenderer'
  | 'TableFooterRenderer'
  | 'TableLoadingRenderer'
  | 'TableRowsRenderer'
  | 'TableRowRenderer'
  | 'TableCellRenderer'
  | 'TableNoResultsRowRenderer'
> & {
  TableHeaderRenderer: Renderer;
  TablePageRenderer: Renderer;
  TableWrapperRenderer: Renderer<{ children?: ReactNode }>;
  TableTBodyRenderer: Renderer<{ children?: ReactNode }>;
  TablePaginationRenderer: Renderer;
  TableFooterRenderer: Renderer;
  TableLoadingRenderer: Renderer<{ spinnerProps?: Record<string, any> }>;
  TableRowsRenderer: Renderer;
  TableRowRenderer: Renderer<{
    row: Row<D>;
    index?: number;
    className?: string;
    style?: React.CSSProperties;
    TableCellRenderer?: Renderer<any>;
  }>;
  TableCellRenderer: Renderer<{
    cell: any;
    row: Row<D>;
    index?: number;
  }>;
  TableNoResultsRowRenderer: Renderer;
};

export interface TableContextValue<D extends object = any> {
  table: TableInstance<D>;
  props: ResolvedDataTableProps<D>;
}
