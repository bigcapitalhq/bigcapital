import React from 'react';
import { useVendorCreditDetailDrawerContext } from '../VendorCreditDetailDrawerProvider';
import {
  useRefundCreditTransactionsTableColumns,
  ActionsMenu,
} from './components';
import { DataTable, Card } from '@/components';
import { TableStyle } from '@/constants';
import {
  withAlertActions,
  WithAlertActionsProps,
} from '@/containers/Alert/withAlertActions';
import { compose } from '@/utils';

interface RefundVendorCreditTransactionsTableInnerProps
  extends WithAlertActionsProps {}

/**
 * Refund vendor transactions table.
 */
function RefundVendorCreditTransactionsTableInner({
  // #withAlertActions
  openAlert,
}: RefundVendorCreditTransactionsTableInnerProps) {
  const { refundVendorCredit } = useVendorCreditDetailDrawerContext();
  const columns = useRefundCreditTransactionsTableColumns();

  // Handle delete refund vendor credit.
  const handleDeleteRefundVendorCredit = ({ id }: { id: number }) => {
    openAlert('refund-vendor-delete', { vendorCreditId: id });
  };

  return (
    <Card>
      <DataTable
        columns={columns}
        data={refundVendorCredit}
        ContextMenu={ActionsMenu}
        styleName={TableStyle.Constrant}
        payload={{
          onDelete: handleDeleteRefundVendorCredit,
        }}
      />
    </Card>
  );
}

export const RefundVendorCreditTransactionsTable = compose(withAlertActions)(
  RefundVendorCreditTransactionsTableInner,
);
