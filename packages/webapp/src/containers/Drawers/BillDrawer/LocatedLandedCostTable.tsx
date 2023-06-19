// @ts-nocheck
import React from 'react';
import {
  DataTable,
  TableSkeletonRows,
  Card,
  FormattedMessage as T,
} from '@/components';

import { useLocatedLandedCostColumns, ActionsMenu } from './components';
import { useBillDrawerContext } from './BillDrawerProvider';

import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import { TableStyle } from '@/constants';

import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

/**
 * Located landed cost table.
 */
function LocatedLandedCostTable({
  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  openDrawer,
}) {
  // Located landed cost table columns.
  const columns = useLocatedLandedCostColumns();

  // Bill drawer context.
  const { transactions, billId } = useBillDrawerContext();

  // Handle the transaction delete action.
  const handleDeleteTransaction = ({ id }) => {
    openAlert('bill-located-cost-delete', { BillId: id });
  };

  // Handle from transaction link click.
  const handleFromTransactionClick = (original) => {
    const { from_transaction_type, from_transaction_id } = original;

    switch (from_transaction_type) {
      case 'Expense':
        openDrawer(DRAWERS.EXPENSE_DETAILS, { expenseId: from_transaction_id });
        break;

      case 'Bill':
      default:
        openDrawer(DRAWERS.BILL_DETAILS, { billId: from_transaction_id });
        break;
    }
  };

  return (
    <div>
      <Card>
        <DataTable
          columns={columns}
          data={transactions}
          ContextMenu={ActionsMenu}
          TableLoadingRenderer={TableSkeletonRows}
          styleName={TableStyle.Constraint}
          payload={{
            onDelete: handleDeleteTransaction,
            onFromTranscationClick: handleFromTransactionClick,
          }}
        />
      </Card>
    </div>
  );
}

export default compose(
  withAlertsActions,
  withDrawerActions,
)(LocatedLandedCostTable);
