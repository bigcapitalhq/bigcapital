import {
  BP_Table,
  withPagination,
} from '@bigcapitalhq/blueprintjs-react-table';
import { functionalUpdate } from '@tanstack/react-table';
import * as FF from 'fp-ts/function';
import React from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import '@bigcapitalhq/blueprintjs-react-table/styles.css';
import { useInvoicesTableColumns, ActionsMenu } from './components';
import { InvoicesEmptyStatus } from './InvoicesEmptyStatus';
import { useInvoicesListContext } from './InvoicesListProvider';
import { withInvoiceActions } from './withInvoiceActions';
import { withInvoices } from './withInvoices';
import type { InvoiceTableRow } from './components';
import type { WithInvoiceActionsProps } from './withInvoiceActions';
import type { WithInvoicesProps } from './withInvoices';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import type { BP_PaginatedTableProps } from '@bigcapitalhq/blueprintjs-react-table';
import {
  DashboardContentTable,
  EmptyStatus,
  MaterialProgressBar,
} from '@/components';
import {
  getRowId,
  TABLE_LOADING_OPTIONS,
  useTableRowSelection,
} from '@/components/Datatable/blueprintTable';
import { DRAWERS } from '@/constants/drawers';
import { TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useMemorizedColumnsWidths } from '@/hooks';

interface InvoicesDataTableProps
  extends Pick<
      WithInvoicesProps,
      'invoicesTableState' | 'invoicesSelectedRows'
    >,
    WithInvoiceActionsProps,
    WithAlertActionsProps,
    WithDrawerActionsProps,
    WithDialogActionsProps {}

type InvoiceTableProps = BP_PaginatedTableProps<InvoiceTableRow>;

const InvoiceTable = withPagination<InvoiceTableRow>(BP_Table);
const EMPTY_INVOICES: InvoiceTableRow[] = [];
const PAGE_SIZE_OPTIONS = [20, 30, 50, 75, 100, 150];

function InvoicesDataTableInner({
  setInvoicesTableState,
  setInvoicesSelectedRows,
  invoicesTableState,
  invoicesSelectedRows,
  openAlert,
  openDrawer,
  openDialog,
}: InvoicesDataTableProps) {
  const history = useHistory();

  const {
    invoices,
    pagination: pageMeta,
    isEmptyStatus,
    isInvoicesLoading,
    isInvoicesFetching,
    invoiceSettings,
  } = useInvoicesListContext();
  const data = invoices ?? EMPTY_INVOICES;
  const rowHeight = invoiceSettings?.tableSize === 'small' ? 18 : undefined;
  const loadingOptions = isInvoicesLoading ? TABLE_LOADING_OPTIONS : undefined;
  const hasNoResults = !isInvoicesLoading && data.length === 0;
  const showPaginationBar = data.length > 0;
  const columns = useInvoicesTableColumns();
  const [columnSizing, setColumnSizing] = useMemorizedColumnsWidths(
    TABLES.INVOICES,
  );
  const { rowSelection, onRowSelectionChange } = useTableRowSelection(
    invoicesSelectedRows,
    setInvoicesSelectedRows,
  );
  const pagination = {
    pageIndex: invoicesTableState.pageIndex ?? 0,
    pageSize: invoicesTableState.pageSize ?? 20,
  };
  const sorting = invoicesTableState.sortBy ?? [];
  const tableState = { columnSizing, pagination, sorting };
  // An unknown total keeps the current page while its request is in flight.
  const total = pageMeta?.total;

  const onSortingChange: InvoiceTableProps['onSortingChange'] = (update) => {
    setInvoicesTableState({ sortBy: functionalUpdate(update, sorting) });
  };
  const onPaginationChange: InvoiceTableProps['onPaginationChange'] = (
    update,
  ) => {
    setInvoicesTableState(functionalUpdate(update, pagination));
  };

  const handleDeleteInvoice = ({ id }: InvoiceTableRow) => {
    openAlert('invoice-delete', { invoiceId: id });
  };

  const handleDeliverInvoice = ({ id }: InvoiceTableRow) => {
    openAlert('invoice-deliver', { invoiceId: id });
  };

  const handleEditInvoice = (invoice: InvoiceTableRow) => {
    history.push(`/invoices/${invoice.id}/edit`);
  };

  const handleConvertToCreditNote = ({ id }: InvoiceTableRow) => {
    history.push(`/credit-notes/new?from_invoice_id=${id}`, { invoiceId: id });
  };

  const handleQuickPaymentReceive = ({ id }: InvoiceTableRow) => {
    openDialog('quick-payment-receive', { invoiceId: id });
  };

  const handleViewDetailInvoice = ({ id }: InvoiceTableRow) => {
    openDrawer(DRAWERS.INVOICE_DETAILS, { invoiceId: id });
  };

  const handlePrintInvoice = ({ id }: InvoiceTableRow) => {
    openDialog('invoice-pdf-preview', { invoiceId: id });
  };

  const handleSendMailInvoice = ({ id }: InvoiceTableRow) => {
    openDrawer(DRAWERS.INVOICE_SEND_MAIL, { invoiceId: id });
  };

  const payload = {
    onDelete: handleDeleteInvoice,
    onDeliver: handleDeliverInvoice,
    onEdit: handleEditInvoice,
    onQuick: handleQuickPaymentReceive,
    onViewDetails: handleViewDetailInvoice,
    onPrint: handlePrintInvoice,
    onConvert: handleConvertToCreditNote,
    onSendMail: handleSendMailInvoice,
  };
  const getCellProps: InvoiceTableProps['getCellProps'] = ({
    row,
    column,
  }) => ({
    'data-testId': column.id === 'invoice_no' ? 'invoice-row' : undefined,
    'data-invoice-id': row.original.id,
    tabIndex: 0,
    onClick: () => handleViewDetailInvoice(row.original),
  });
  const bodyContextMenuRenderer: InvoiceTableProps['bodyContextMenuRenderer'] =
    (context) => {
      const row = context.getTargetRow();
      return row && <ActionsMenu row={row} payload={payload} />;
    };

  if (isEmptyStatus) {
    return <InvoicesEmptyStatus />;
  }

  return (
    <DashboardContentTable>
      {isInvoicesFetching && !isInvoicesLoading && <MaterialProgressBar />}
      <InvoiceTable
        columns={columns}
        data={data}
        getRowId={getRowId}
        enableRowHeader={false}
        rowHeight={rowHeight}
        enableSorting
        manualSorting
        onSortingChange={onSortingChange}
        manualPagination
        autoResetPageIndex={false}
        rowCount={total}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        showPaginationBar={showPaginationBar}
        onPaginationChange={onPaginationChange}
        state={tableState}
        onColumnSizingChange={setColumnSizing}
        showRowSelectionCheckboxes
        rowSelection={rowSelection}
        onRowSelectionChange={onRowSelectionChange}
        getCellProps={getCellProps}
        bodyContextMenuRenderer={bodyContextMenuRenderer}
        enableBodyContextMenu={!isInvoicesFetching}
        enableGhostCells={isInvoicesLoading}
        loadingOptions={loadingOptions}
      />
      {hasNoResults && (
        <EmptyStatus title={intl.get('there_is_no_results_in_the_table')} />
      )}
    </DashboardContentTable>
  );
}

export const InvoicesDataTable = FF.pipe(
  InvoicesDataTableInner,
  withInvoices(({ invoicesTableState, invoicesSelectedRows }) => ({
    invoicesTableState,
    invoicesSelectedRows,
  })),
  withDialogActions,
  withDrawerActions,
  withAlertActions,
  withInvoiceActions,
);
