import * as FF from 'fp-ts/function';
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
import { createDashboardListTable } from '@/components/Datatable/DashboardListTable';
import { DRAWERS } from '@/constants/drawers';
import { TABLES } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';

const Table = createDashboardListTable({
  tableName: TABLES.VENDORS,
  rowName: 'vendor',
  identifierColumn: 'display_name',
  ActionsMenu,
});

interface VendorsTableInnerProps
  extends Pick<WithVendorsProps, 'vendorsTableState' | 'vendorsSelectedRows'>,
    WithVendorsActionsProps,
    WithAlertActionsProps,
    WithDialogActionsProps,
    WithDrawerActionsProps {}

type VendorRow = Pick<Vendor, 'id'>;
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
  const compact = vendorsSettings?.tableSize === 'small';
  const columns = useVendorsTableColumns(compact ? 'small' : 'medium');

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

  // Display empty status instead of the table.
  if (isEmptyStatus) {
    return <VendorsEmptyStatus />;
  }

  return (
    <Table
      columns={columns}
      data={vendors}
      total={pagination?.total}
      loading={isVendorsLoading}
      fetching={isVendorsFetching}
      compact={compact}
      query={vendorsTableState}
      setQuery={setVendorsTableState}
      selectedIds={vendorsSelectedRows}
      setSelectedIds={setVendorsSelectedRows}
      actions={{
        onEdit: handleEditVendor,
        onDelete: handleDeleteVendor,
        onDuplicate: handleContactDuplicate,
        onInactivate: handleInactiveVendor,
        onActivate: handleActivateVendor,
        onViewDetails: handleViewDetailVendor,
      }}
    />
  );
}

export const VendorsTable = FF.pipe(
  VendorsTableInner,
  withVendors(({ vendorsTableState, vendorsSelectedRows }) => ({
    vendorsTableState,
    vendorsSelectedRows,
  })),
  withDrawerActions,
  withDialogActions,
  withAlertActions,
  withVendorsActions,
);
