import { useHistory } from 'react-router-dom';
import { useInvoiceDetailDrawerContext } from '../InvoiceDetailDrawerProvider';
import {
  useInvoicePaymentTransactionsColumns,
  ActionsMenu,
} from './components';
import type { InvoicePaymentTransactionsResponse } from '@bigcapital/sdk-ts';
import { DataTable, Card, TableSkeletonRows } from '@/components';
import { TableStyle } from '@/constants';
import { DRAWERS } from '@/constants/drawers';
import {
  withAlertActions,
  WithAlertActionsProps,
} from '@/containers/Alert/withAlertActions';
import {
  withDrawerActions,
  WithDrawerActionsProps,
} from '@/containers/Drawer/withDrawerActions';
import { useInvoicePaymentTransactions } from '@/hooks/query';
import { compose } from '@/utils';

type InvoicePaymentTransaction = InvoicePaymentTransactionsResponse[number];

interface InvoicePaymentTransactionsTableInnerProps
  extends WithAlertActionsProps,
    WithDrawerActionsProps {}

/**
 * Invoice payment transactions datatable.
 */
function InvoicePaymentTransactionsTableInner({
  // #withAlertActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}: InvoicePaymentTransactionsTableInnerProps) {
  const history = useHistory();

  // Invoice payment transactions table columns.
  const columns = useInvoicePaymentTransactionsColumns();

  // Invoice drawer context.
  const { invoiceId } = useInvoiceDetailDrawerContext();

  // Fetch invoice payment transactions.
  const {
    data: paymentTransactions,
    isFetching: isPaymentTransactionFetching,
    isLoading: isPaymentTransactionLoading,
  } = useInvoicePaymentTransactions(invoiceId, {
    enabled: !!invoiceId,
  });

  // Handles delete payment transactions.
  const handleDeletePaymentTransactons = (
    row: Pick<InvoicePaymentTransaction, 'paymentReceiveId'>,
  ) => {
    openAlert('payment-received-delete', {
      paymentReceiveId: row.paymentReceiveId,
    });
  };

  // Handles edit payment transactions.
  const handleEditPaymentTransactions = (
    row: Pick<InvoicePaymentTransaction, 'paymentReceiveId'>,
  ) => {
    history.push(`/payments-received/${row.paymentReceiveId}/edit`);
    closeDrawer(DRAWERS.INVOICE_DETAILS);
  };
  return (
    <Card>
      <DataTable
        columns={columns}
        data={paymentTransactions ?? []}
        loading={isPaymentTransactionLoading}
        headerLoading={isPaymentTransactionLoading}
        progressBarLoading={isPaymentTransactionFetching}
        TableLoadingRenderer={TableSkeletonRows}
        styleName={TableStyle.Constrant}
        ContextMenu={ActionsMenu}
        payload={{
          onDelete: handleDeletePaymentTransactons,
          onEdit: handleEditPaymentTransactions,
        }}
      />
    </Card>
  );
}

export const InvoicePaymentTransactionsTable = compose(
  withAlertActions,
  withDrawerActions,
)(InvoicePaymentTransactionsTableInner);
