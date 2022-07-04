import React from 'react';
import { useHistory } from 'react-router-dom';

import VendorsCreditNoteEmptyStatus from './VendorsCreditNoteEmptyStatus';
import { DataTable, DashboardContentTable } from '@/components';
import { TABLES } from 'common/tables';
import { useMemorizedColumnsWidths } from 'hooks';

import TableSkeletonRows from '@/components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from '@/components/Datatable/TableHeaderSkeleton';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withVendorsCreditNotesActions from './withVendorsCreditNotesActions';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withSettings from '../../../Settings/withSettings';

import { useVendorsCreditNoteTableColumns, ActionsMenu } from './components';
import { useVendorsCreditNoteListContext } from './VendorsCreditNoteListProvider';

import { compose } from 'utils';

/**
 * Vendors Credit note data table.
 */
function VendorsCreditNoteDataTable({
  // #withVendorsCreditNotesActions
  setVendorsCreditNoteTableState,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  openDrawer,

  // #withDialogAction
  openDialog,

  // #withSettings
  creditNoteTableSize,
}) {
  const history = useHistory();

  // Vendor credits context.
  const {
    vendorCredits,
    pagination,
    isEmptyStatus,
    isVendorCreditsFetching,
    isVendorCreditsLoading,
  } = useVendorsCreditNoteListContext();

  // Credit note table columns.
  const columns = useVendorsCreditNoteTableColumns();

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.VENDOR_CREDITS);

  // Handles fetch data once the table state change.
  const handleDataTableFetchData = React.useCallback(
    ({ pageSize, pageIndex, sortBy }) => {
      setVendorsCreditNoteTableState({
        pageSize,
        pageIndex,
        sortBy,
      });
    },
    [setVendorsCreditNoteTableState],
  );

  // Display create note empty status instead of the table.
  if (isEmptyStatus) {
    return <VendorsCreditNoteEmptyStatus />;
  }

  const handleViewDetailVendorCredit = ({ id }) => {
    openDrawer('vendor-credit-detail-drawer', { vendorCreditId: id });
  };

  // Handle delete credit note.
  const handleDeleteVendorCreditNote = ({ id }) => {
    openAlert('vendor-credit-delete', { vendorCreditId: id });
  };

  // Handle edit credit note.
  const hanldeEditVendorCreditNote = (vendorCredit) => {
    history.push(`/vendor-credits/${vendorCredit.id}/edit`);
  };

  // Handle cell click.
  const handleCellClick = (cell, event) => {
    openDrawer('vendor-credit-detail-drawer', {
      vendorCreditId: cell.row.original.id,
    });
  };

  const handleRefundCreditVendor = ({ id }) => {
    openDialog('refund-vendor-credit', { vendorCreditId: id });
  };

  // Handle cancel/confirm vendor credit open.
  const handleOpenCreditNote = ({ id }) => {
    openAlert('vendor-credit-open', { vendorCreditId: id });
  };

  // Handle reconcile credit note.
  const handleReconcileVendorCredit = ({ id }) => {
    openDialog('reconcile-vendor-credit', { vendorCreditId: id });
  };

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={vendorCredits}
        loading={isVendorCreditsLoading}
        headerLoading={isVendorCreditsLoading}
        progressBarLoading={isVendorCreditsFetching}
        onFetchData={handleDataTableFetchData}
        manualSortBy={true}
        selectionColumn={true}
        noInitialFetch={true}
        sticky={true}
        pagination={true}
        pagesCount={pagination.pagesCount}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ActionsMenu}
        onCellClick={handleCellClick}
        initialColumnsWidths={initialColumnsWidths}
        onColumnResizing={handleColumnResizing}
        size={creditNoteTableSize}
        payload={{
          onViewDetails: handleViewDetailVendorCredit,
          onDelete: handleDeleteVendorCreditNote,
          onEdit: hanldeEditVendorCreditNote,
          onRefund: handleRefundCreditVendor,
          onOpen: handleOpenCreditNote,
          onReconcile: handleReconcileVendorCredit,
        }}
      />
    </DashboardContentTable>
  );
}

export default compose(
  withDashboardActions,
  withVendorsCreditNotesActions,
  withAlertsActions,
  withDrawerActions,
  withDialogActions,
  withSettings(({ vendorsCreditNoteSetting }) => ({
    creditNoteTableSize: vendorsCreditNoteSetting?.tableSize,
  })),
)(VendorsCreditNoteDataTable);
