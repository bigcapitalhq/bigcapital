import * as FF from 'fp-ts/function';
import React from 'react';
import intl from 'react-intl-universal';
import { useRecurringInvoiceDetailDrawerContext } from './RecurringInvoiceDetailDrawerProvider';
import type { DataTableColumn } from '@/components/Datatable/types';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import type { RecurringInvoiceInvoicesResponse } from '@bigcapital/sdk-ts';
import { DataTable, Card, EmptyStatus, TableSkeletonRows } from '@/components';
import { TableStyle } from '@/constants';
import { DRAWERS } from '@/constants/drawers';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { InvoiceStatus } from '@/containers/Sales/Invoices/InvoicesLanding/components';
import { useRecurringInvoiceInvoices } from '@/hooks/query';

type GeneratedInvoice = NonNullable<
  RecurringInvoiceInvoicesResponse['data']
>[number];

interface RecurringInvoiceGeneratedInvoicesTabInnerProps
  extends WithDrawerActionsProps {}

/**
 * Retrieve generated invoices table columns.
 */
function useGeneratedInvoicesTableColumns(): Array<
  DataTableColumn<GeneratedInvoice>
> {
  return React.useMemo(
    () => [
      {
        id: 'invoice_no',
        Header: intl.get('invoice_no__'),
        accessor: 'invoiceNo',
        width: 110,
        clickable: true,
        textOverview: true,
      },
      {
        id: 'invoice_date',
        Header: intl.get('invoice_date'),
        accessor: 'invoiceDateFormatted',
        width: 120,
        clickable: true,
        textOverview: true,
      },
      {
        id: 'due_date',
        Header: intl.get('due_date'),
        accessor: 'dueDateFormatted',
        width: 120,
        clickable: true,
        textOverview: true,
      },
      {
        id: 'amount',
        Header: intl.get('amount'),
        accessor: 'totalFormatted',
        width: 120,
        align: 'right',
        clickable: true,
        textOverview: true,
        money: true,
      },
      {
        id: 'status',
        Header: intl.get('status'),
        accessor: (invoice) => <InvoiceStatus invoice={invoice} />,
        width: 150,
        clickable: true,
      },
    ],
    [],
  );
}

/**
 * Recurring invoice generated invoices tab panel.
 */
function RecurringInvoiceGeneratedInvoicesTabInner({
  // #withDrawerActions
  openDrawer,
}: RecurringInvoiceGeneratedInvoicesTabInnerProps) {
  const { recurringInvoiceId } = useRecurringInvoiceDetailDrawerContext();

  const { data, isLoading, isFetching } = useRecurringInvoiceInvoices(
    recurringInvoiceId,
    { pageSize: 100 },
    { enabled: !!recurringInvoiceId },
  );

  const columns = useGeneratedInvoicesTableColumns();
  const invoices = data?.data ?? [];

  const handleCellClick = (cell: {
    row: { original: GeneratedInvoice };
  }): void => {
    openDrawer(DRAWERS.INVOICE_DETAILS, {
      invoiceId: cell.row.original.id,
    });
  };

  if (!isLoading && invoices.length === 0) {
    return (
      <Card>
        <EmptyStatus
          title={intl.get('recurring_invoice.no_generated_invoices')}
        />
      </Card>
    );
  }

  return (
    <Card>
      <DataTable
        columns={columns}
        data={invoices}
        loading={isLoading}
        headerLoading={isLoading}
        progressBarLoading={isFetching}
        TableLoadingRenderer={TableSkeletonRows}
        styleName={TableStyle.Constrant}
        noInitialFetch={true}
        onCellClick={handleCellClick}
      />
    </Card>
  );
}

export const RecurringInvoiceGeneratedInvoicesTab = FF.pipe(
  RecurringInvoiceGeneratedInvoicesTabInner,
  withDrawerActions,
);
