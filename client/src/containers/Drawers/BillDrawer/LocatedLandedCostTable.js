import React from 'react';
import { DataTable } from 'components';
import { useLocatedLandedCostColumns, ActionsMenu } from './components';
import { useBillDrawerContext } from './BillDrawerProvider';

import withAlertsActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * Located landed cost table.
 */
function LocatedLandedCostTable({
  // #withAlertsActions
  openAlert,
}) {
  const columns = useLocatedLandedCostColumns();
  const { transactions } = useBillDrawerContext();

  // Handle the transaction delete action.
  const handleDeleteTransaction = ({ id }) => {
    openAlert('transaction-delete', { BillId: id });
  };

  return (
    <DataTable
      columns={columns}
      data={transactions}
      ContextMenu={ActionsMenu}
      payload={{
        onDelete: handleDeleteTransaction,
      }}
    />
  );
}

export default compose(withAlertsActions)(LocatedLandedCostTable);
