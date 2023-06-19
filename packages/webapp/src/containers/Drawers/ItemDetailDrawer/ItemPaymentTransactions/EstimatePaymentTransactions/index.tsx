// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';

import { DataTable, TableSkeletonRows } from '@/components';
import { TableStyle } from '@/constants';

import { useItemDetailDrawerContext } from '../../ItemDetailDrawerProvider';
import { useItemAssociatedEstimateTransactions } from '@/hooks/query';
import { useEstimateTransactionsColumns, ActionsMenu } from './components';

import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

/**
 * Esimtate payment transactions.
 */
function EstimatePaymentTransactions({
  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const history = useHistory();

  // Estimate transactions table columns.
  const columns = useEstimateTransactionsColumns();

  const { itemId } = useItemDetailDrawerContext();

  // Handle fetch Estimate associated transactions.
  const {
    isLoading: isEstimateTransactionsLoading,
    isFetching: isEstimateTransactionFetching,
    data: paymentTransactions,
  } = useItemAssociatedEstimateTransactions(itemId, {
    enabled: !!itemId,
  });

  // Handles delete payment transactions.
  const handleDeletePaymentTransactons = ({ estimate_id }) => {
    openAlert('estimate-delete', {
      estimateId: estimate_id,
    });
  };

  // Handles edit payment transactions.
  const handleEditPaymentTransactions = ({ estimate_id }) => {
    history.push(`/estimates/${estimate_id}/edit`);
    closeDrawer(DRAWERS.ITEM_DETAILS);
  };

  return (
    <DataTable
      columns={columns}
      data={paymentTransactions}
      loading={isEstimateTransactionsLoading}
      headerLoading={isEstimateTransactionsLoading}
      progressBarLoading={isEstimateTransactionFetching}
      ContextMenu={ActionsMenu}
      payload={{
        onEdit: handleEditPaymentTransactions,
        onDelete: handleDeletePaymentTransactons,
      }}
      styleName={TableStyle.Constraint}
      TableLoadingRenderer={TableSkeletonRows}
      sticky={true}
    />
  );
}
export default compose(
  withAlertsActions,
  withDrawerActions,
)(EstimatePaymentTransactions);
