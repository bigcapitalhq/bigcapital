import React from 'react';
import { DataTable, Card } from 'components';

import '../../../../style/pages/RefundCreditNote/List.scss';

import withAlertsActions from 'containers/Alert/withAlertActions';
import { useVendorCreditDetailDrawerContext } from '../VendorCreditDetailDrawerProvider';
import {
  useReconcileVendorCreditTransactionsTableColumns,
  ActionsMenu,
} from './components';
import { compose } from 'utils';

/**
 * Reconcile vendor credit transactions table.
 */
function ReconcileVendorCreditTransactionsTable({
  // #withAlertsActions
  openAlert,
}) {
  const columns = useReconcileVendorCreditTransactionsTableColumns();

  const { reconcileVendorCredits } = useVendorCreditDetailDrawerContext();

  // Handle delete reconile credit.
  const handleDeleteReconcileVendorCredit = ({ id }) => {
    openAlert('reconcile-vendor-delete', { vendorCreditId: id });
  };

  return (
    <Card>
      <DataTable
        columns={columns}
        data={reconcileVendorCredits}
        ContextMenu={ActionsMenu}
        payload={{
          onDelete: handleDeleteReconcileVendorCredit,
        }}
        className={'datatable--refund-transactions'}
      />
    </Card>
  );
}

export default compose(withAlertsActions)(
  ReconcileVendorCreditTransactionsTable,
);
