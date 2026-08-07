import React from 'react';
import { useVendorCreditDetailDrawerContext } from '../VendorCreditDetailDrawerProvider';
import {
  useReconcileVendorCreditTransactionsTableColumns,
  ActionsMenu,
} from './components';
import { DataTable, Card } from '@/components';
import { TableStyle } from '@/constants';
import {
  withAlertActions,
  WithAlertActionsProps,
} from '@/containers/Alert/withAlertActions';
import { compose } from '@/utils';

interface ReconcileVendorCreditTransactionsTableInnerProps
  extends WithAlertActionsProps {}

/**
 * Reconcile vendor credit transactions table.
 */
function ReconcileVendorCreditTransactionsTableInner({
  // #withAlertActions
  openAlert,
}: ReconcileVendorCreditTransactionsTableInnerProps) {
  const columns = useReconcileVendorCreditTransactionsTableColumns();
  const { reconcileVendorCredits } = useVendorCreditDetailDrawerContext();

  // Handle delete reconile credit.
  const handleDeleteReconcileVendorCredit = ({ id }: { id: number }) => {
    openAlert('reconcile-vendor-delete', { vendorCreditId: id });
  };

  return (
    <Card>
      <DataTable
        columns={columns}
        data={reconcileVendorCredits}
        ContextMenu={ActionsMenu}
        styleName={TableStyle.Constrant}
        payload={{
          onDelete: handleDeleteReconcileVendorCredit,
        }}
      />
    </Card>
  );
}

export const ReconcileVendorCreditTransactionsTable = compose(withAlertActions)(
  ReconcileVendorCreditTransactionsTableInner,
);
