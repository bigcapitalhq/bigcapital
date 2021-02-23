import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { compose } from 'utils';
import { DataTable } from 'components';

import ReceiptsEmptyStatus from './ReceiptsEmptyStatus';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';

import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';
import withReceipts from './withReceipts';
import withReceiptsActions from './withReceiptsActions';
import withSettings from 'containers/Settings/withSettings';

import { useReceiptsListContext } from './ReceiptsListProvider';
import { useReceiptsTableColumns, ActionsMenu } from './components';

/**
 * Sale receipts datatable.
 */
function ReceiptsDataTable({
  // #withReceiptsActions
  setReceiptsTableState,

  // #withReceipts
  receiptTableState,

  // #withSettings
  baseCurrency,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  openDrawer,
}) {
  const history = useHistory();

  // Receipts list context.
  const {
    receipts,
    pagination,
    isReceiptsFetching,
    isReceiptsLoading,
    isEmptyStatus,
  } = useReceiptsListContext();

  // Receipts table columns.
  const columns = useReceiptsTableColumns();

  // Handle receipt edit action.
  const handleEditReceipt = ({ id }) => {
    history.push(`/receipts/${id}/edit`);
  };

  // Handles receipt delete action.
  const handleDeleteReceipt = (receipt) => {
    openAlert('receipt-delete', { receiptId: receipt.id });
  };

  // Handles receipt close action.
  const handleCloseReceipt = (receipt) => {
    openAlert('receipt-close', { receiptId: receipt.id });
  };

    // Handle drawer receipts.
    const handleDrawerReceipt = () => {
      openDrawer('receipt-drawer', {});
    };

  // Handles the datable fetch data once the state changing.
  const handleDataTableFetchData = useCallback(
    ({ sortBy, pageIndex, pageSize }) => {
      setReceiptsTableState({
        pageIndex,
        pageSize,
        sortBy,
      });
    },
    [setReceiptsTableState],
  );

  if (isEmptyStatus) {
    return <ReceiptsEmptyStatus />;
  }

  return (
    <DataTable
      columns={columns}
      data={receipts}
      initialState={receiptTableState}
      loading={isReceiptsLoading}
      headerLoading={isReceiptsLoading}
      progressBarLoading={isReceiptsFetching}
      onFetchData={handleDataTableFetchData}
      manualSortBy={true}
      selectionColumn={true}
      noInitialFetch={true}
      sticky={true}
      pagination={true}
      pagesCount={pagination.pagesCount}
      manualPagination={true}
      autoResetSortBy={false}
      autoResetPage={false}
      TableLoadingRenderer={TableSkeletonRows}
      TableHeaderSkeletonRenderer={TableSkeletonHeader}
      ContextMenu={ActionsMenu}
      payload={{
        onEdit: handleEditReceipt,
        onDelete: handleDeleteReceipt,
        onClose: handleCloseReceipt,
        onDrawer:handleDrawerReceipt,
        baseCurrency,
      }}
    />
  );
}

export default compose(
  withAlertsActions,
  withReceiptsActions,
  withDrawerActions,
  withReceipts(({ receiptTableState }) => ({
    receiptTableState,
  })),
  withSettings(({ organizationSettings }) => ({
    baseCurrency: organizationSettings?.baseCurrency,
  })),
)(ReceiptsDataTable);
