import * as FF from 'fp-ts/function';
import React from 'react';
import { useHistory } from 'react-router-dom';
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
import { createDashboardListTable } from '@/components/Datatable/DashboardListTable';
import { DRAWERS } from '@/constants/drawers';
import { isSmallTableSize, TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';

const Table = createDashboardListTable({
  tableName: TABLES.INVOICES,
  rowName: 'invoice',
  identifierColumn: 'invoice_no',
  ActionsMenu,
});

interface InvoicesDataTableProps
  extends Pick<
      WithInvoicesProps,
      'invoicesTableState' | 'invoicesSelectedRows'
    >,
    WithInvoiceActionsProps,
    WithAlertActionsProps,
    WithDrawerActionsProps,
    WithDialogActionsProps {}

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
    pagination,
    isEmptyStatus,
    isInvoicesLoading,
    isInvoicesFetching,
    invoiceSettings,
  } = useInvoicesListContext();
  const columns = useInvoicesTableColumns();
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

  if (isEmptyStatus) {
    return <InvoicesEmptyStatus />;
  }

  const actions = {
    onDelete: handleDeleteInvoice,
    onDeliver: handleDeliverInvoice,
    onEdit: handleEditInvoice,
    onQuick: handleQuickPaymentReceive,
    onViewDetails: handleViewDetailInvoice,
    onPrint: handlePrintInvoice,
    onConvert: handleConvertToCreditNote,
    onSendMail: handleSendMailInvoice,
  };

  return (
    <Table
      columns={columns}
      data={invoices}
      total={pagination?.total}
      loading={isInvoicesLoading}
      fetching={isInvoicesFetching}
      compact={isSmallTableSize(invoiceSettings?.tableSize)}
      query={invoicesTableState}
      setQuery={setInvoicesTableState}
      selectedIds={invoicesSelectedRows}
      setSelectedIds={setInvoicesSelectedRows}
      actions={actions}
    />
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
