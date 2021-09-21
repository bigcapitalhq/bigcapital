import React from 'react';
import { DataTable, Card } from 'components';
import { Button, Classes, NavbarGroup } from '@blueprintjs/core';

import { useLocatedLandedCostColumns, ActionsMenu } from './components';
import { useBillDrawerContext } from './BillDrawerProvider';

import withAlertsActions from 'containers/Alert/withAlertActions';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { compose } from 'utils';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import Icon from 'components/Icon';

/**
 * Located landed cost table.
 */
function LocatedLandedCostTable({
  // #withAlertsActions
  openAlert,

  // #withDialogActions
  openDialog,

  // #withDrawerActions
  openDrawer,
}) {
  const columns = useLocatedLandedCostColumns();
  const { transactions, billId } = useBillDrawerContext();

  // Handle the transaction delete action.
  const handleDeleteTransaction = ({ id }) => {
    openAlert('bill-located-cost-delete', { BillId: id });
  };

  // Handle allocate landed cost button click.
  const handleAllocateCostClick = () => {
    openDialog('allocate-landed-cost', { billId });
  };

  // Handle from transaction link click.
  const handleFromTransactionClick = (original) => {
    const { from_transaction_type, from_transaction_id } = original;

    switch (from_transaction_type) {
      case 'Expense':
        openDrawer('expense-drawer', { expenseId: from_transaction_id });
        break;

      case 'Bill':
      default:
        openDrawer('bill-drawer', { billId: from_transaction_id });
        break;
    }
  };

  return (
    <div>
      <DashboardActionsBar>
        <NavbarGroup>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="receipt-24" />}
            text={'Allocate landed cost'}
            onClick={handleAllocateCostClick}
          />
        </NavbarGroup>
      </DashboardActionsBar>

      <Card>
        <DataTable
          columns={columns}
          data={transactions}
          ContextMenu={ActionsMenu}
          payload={{
            onDelete: handleDeleteTransaction,
            onFromTranscationClick: handleFromTransactionClick,
          }}
          className={'datatable--landed-cost-transactions'}
        />
      </Card>
    </div>
  );
}

export default compose(
  withAlertsActions,
  withDialogActions,
  withDrawerActions,
)(LocatedLandedCostTable);
