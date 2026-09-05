import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { ActionsMenu, useVendorsTableColumns } from './components';
import { VendorsEmptyStatus } from './VendorsEmptyStatus';
import { useVendorsListContext } from './VendorsListProvider';
import { withVendors } from './withVendors';
import { withVendorsActions } from './withVendorsActions';
import type { WithVendorsProps } from './withVendors';
import type { WithVendorsActionsProps } from './withVendorsActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import type { Vendor } from '@bigcapital/sdk-ts';
import {
  DataTable,
  TableSkeletonRows,
  TableSkeletonHeader,
  DashboardContentTable,
} from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useMemorizedColumnsWidths } from '@/hooks';
import { compose } from '@/utils';

interface VendorsTableInnerProps
  extends Pick<WithVendorsProps, 'vendorsTableState' | 'vendorsSelectedRows'>,
    WithVendorsActionsProps,
    WithAlertActionsProps,
    WithDialogActionsProps,
    WithDrawerActionsProps {}

type VendorRow = Pick<Vendor, 'id'>;
type SortBy = Array<{ id: string; desc: boolean }>;

/**
 * Vendors table.
 */
function VendorsTableInner({
  // #withVendorsActions
  setVendorsTableState,
  setVendorsSelectedRows,

  // #withVendors
  vendorsTableState,
  vendorsSelectedRows,

  // #withAlertActions
  openAlert,

  // #withDrawerActions
  openDrawer,

  // #withDialogActions
  openDialog,
}: VendorsTableInnerProps) {
  // Vendors list context.
  const {
    vendors,
    pagination,
    isVendorsFetching,
    isVendorsLoading,
    isEmptyStatus,
    vendorsSettings,
  } = useVendorsListContext();
  const vendorsTableSize = vendorsSettings?.tableSize as string | undefined;

  // Vendors table columns.
  const columns = useVendorsTableColumns();

  // History context.
  const history = useHistory();

  // Handle edit vendor data table
  const handleEditVendor = (vendor: VendorRow) => {
    history.push(`/vendors/${vendor.id}/edit`);
  };

  // Handle cancel/confirm inactive.
  const handleInactiveVendor = ({ id }: VendorRow) => {
    openAlert('vendor-inactivate', {
      vendorId: id,
    });
  };

  // Handle cancel/confirm activate.
  const handleActivateVendor = ({ id }: VendorRow) => {
    openAlert('vendor-activate', { vendorId: id });
  };

  // Handle click delete vendor.
  const handleDeleteVendor = ({ id }: VendorRow) => {
    openAlert('vendor-delete', { contactId: id });
  };

  // Handle contact duplicate .
  const handleContactDuplicate = ({ id }: VendorRow) => {
    openDialog('contact-duplicate', {
      contactId: id,
    });
  };

  // Handle view detail item.
  const handleViewDetailVendor = ({ id }: VendorRow) => {
    openDrawer(DRAWERS.VENDOR_DETAILS, { vendorId: id });
  };

  // Handle cell click.
  const handleCellClick = (
    cell: { row: { original: VendorRow } },
    _event: React.MouseEvent,
  ) => {
    openDrawer(DRAWERS.VENDOR_DETAILS, { vendorId: cell.row.original.id });
  };

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] =
    useMemorizedColumnsWidths(TABLES.VENDORS);

  // Handle fetch data once the page index, size or sort by of the table change.
  const handleFetchData = useCallback(
    ({
      pageSize,
      pageIndex,
      sortBy,
    }: {
      pageSize: number;
      pageIndex: number;
      sortBy: SortBy;
    }) => {
      setVendorsTableState({
        pageIndex,
        pageSize,
        sortBy,
      });
    },
    [setVendorsTableState],
  );

  const handleSelectedRowsChange = useCallback(
    (selectedFlatRows: Array<{ original: VendorRow }>) => {
      const selectedIds = selectedFlatRows?.map((row) => row.original.id) || [];
      setVendorsSelectedRows(selectedIds);
    },
    [setVendorsSelectedRows],
  );

  // Display empty status instead of the table.
  if (isEmptyStatus) {
    return <VendorsEmptyStatus />;
  }

  return (
    <DashboardContentTable>
      <DataTable
        noInitialFetch={true}
        columns={columns}
        data={vendors ?? []}
        loading={isVendorsLoading}
        headerLoading={isVendorsLoading}
        progressBarLoading={isVendorsFetching}
        onFetchData={handleFetchData}
        selectionColumn={true}
        expandable={false}
        sticky={true}
        pagination={true}
        rowTestId={'vendor-row'}
        initialPageSize={vendorsTableState?.pageSize ?? 10}
        manualSortBy={true}
        rowsCount={pagination?.total ?? 0}
        autoResetSortBy={false}
        autoResetPage={false}
        onSelectedRowsChange={handleSelectedRowsChange}
        selectedRowsIds={vendorsSelectedRows}
        autoResetSelectedRows={false}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ActionsMenu}
        onCellClick={handleCellClick}
        initialColumnsWidths={initialColumnsWidths}
        onColumnResizing={handleColumnResizing}
        size={vendorsTableSize}
        payload={{
          onEdit: handleEditVendor,
          onDelete: handleDeleteVendor,
          onDuplicate: handleContactDuplicate,
          onInactivate: handleInactiveVendor,
          onActivate: handleActivateVendor,
          onViewDetails: handleViewDetailVendor,
        }}
      />
    </DashboardContentTable>
  );
}

export const VendorsTable = compose(
  withVendorsActions,
  withAlertActions,
  withDialogActions,
  withDrawerActions,
  withVendors(({ vendorsTableState, vendorsSelectedRows }) => ({
    vendorsTableState,
    vendorsSelectedRows,
  })),
)(VendorsTableInner);
