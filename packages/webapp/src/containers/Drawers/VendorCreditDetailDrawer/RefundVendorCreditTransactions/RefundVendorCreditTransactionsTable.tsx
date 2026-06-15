// @ts-nocheck
import React from 'react';
import { DataTable, Card } from '@/components';

import { TableStyle } from '@/constants';

import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { useVendorCreditDetailDrawerContext } from '../VendorCreditDetailDrawerProvider';
import {
  useRefundCreditTransactionsTableColumns,
  ActionsMenu,
} from './components';
import { flow } from 'fp-ts/function';

/**
 * Refund vendor transactions table.
 */
function RefundVendorCreditTransactionsTableInner({
  // #withAlertActions
  openAlert,
}) {
  const { refundVendorCredit } = useVendorCreditDetailDrawerContext();

  const columns = useRefundCreditTransactionsTableColumns();

  // Handle delete refund vendor credit.
  const handleDeleteRefundVendorCredit = ({ id }) => {
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

export const RefundVendorCreditTransactionsTable = flow(
  withAlertActions,
)(RefundVendorCreditTransactionsTableInner);
