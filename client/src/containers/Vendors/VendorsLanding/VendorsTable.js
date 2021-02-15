import React from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router';

import { CLASSES } from 'common/classes';
import { DataTable, Choose } from 'components';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';

import VendorsEmptyStatus from './VendorsEmptyStatus';

import { useVendorsListContext } from './VendorsListProvider';
import withVendorsActions from './withVendorsActions';
import withAlertsActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';
import { ActionsMenu, useVendorsTableColumns } from './components';

/**
 * Vendors table.
 */
function VendorsTable({
  // #withVendorsActions
  setVendorsTableState,

  // #withAlertsActions
  openAlert,
}) {
  // Vendors list context.
  const {
    vendors,
    pagination,
    isVendorsFetching,
    isVendorsLoading,
    isEmptyStatus
  } = useVendorsListContext();

  // Vendors table columns.
  const columns = useVendorsTableColumns();

  // History context.
  const history = useHistory();

  // Handle edit vendor data table
  const handleEditVendor = (vendor) => {
    history.push(`/vendors/${vendor.id}/edit`);
  };

  // Handle click delete vendor.
  const handleDeleteVendor = ({ id }) => {
    openAlert('vendor-delete', { vendorId: id });
  };

  // Handle fetch data once the page index, size or sort by of the table change.
  const handleFetchData = React.useCallback(
    ({ pageSize, pageIndex, sortBy }) => {
      setVendorsTableState({
        pageIndex,
        pageSize,
        sortBy,
      });
    },
    [setVendorsTableState],
  );

  // Display empty status instead of the table.
  if (isEmptyStatus) {
    return <VendorsEmptyStatus />
  }

  return (
    <DataTable
      noInitialFetch={true}
      columns={columns}
      data={vendors}
      loading={isVendorsLoading}
      headerLoading={isVendorsLoading}
      progressBarLoading={isVendorsFetching}
      onFetchData={handleFetchData}
      selectionColumn={true}
      expandable={false}
      sticky={true}
      pagination={true}
      manualSortBy={true}
      pagesCount={pagination.pagesCount}
      autoResetSortBy={false}
      autoResetPage={false}
      TableLoadingRenderer={TableSkeletonRows}
      TableHeaderSkeletonRenderer={TableSkeletonHeader}
      ContextMenu={ActionsMenu}
      payload={{
        onEdit: handleEditVendor,
        onDelete: handleDeleteVendor,
      }}
    />
  );
}

export default compose(withVendorsActions, withAlertsActions)(VendorsTable);
