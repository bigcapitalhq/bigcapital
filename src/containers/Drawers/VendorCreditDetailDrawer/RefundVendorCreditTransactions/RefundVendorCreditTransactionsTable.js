import React from 'react';
import { DataTable, Card } from 'components';

import 'style/pages/RefundVendorCredit/List.scss';

import withAlertsActions from 'containers/Alert/withAlertActions';
import { useVendorCreditDetailDrawerContext } from '../VendorCreditDetailDrawerProvider';
import {
  useRefundCreditTransactionsTableColumns,
  ActionsMenu,
} from './components';

import { compose } from 'utils';

/**
 * Refund vendor transactions table.
 */
function RefundVendorCreditTransactionsTable({
  // #withAlertsActions
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
        payload={{
          onDelete: handleDeleteRefundVendorCredit,
        }}
        className={'datatable--refund-transactions'}
      />
    </Card>
  );
}

export default compose(withAlertsActions)(RefundVendorCreditTransactionsTable);
