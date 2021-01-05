import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Intent, Alert } from '@blueprintjs/core';
import { useQuery } from 'react-query';
import {
  FormattedMessage as T,
  FormattedHTMLMessage,
  useIntl,
} from 'react-intl';

import AppToaster from 'components/AppToaster';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import VendorsTable from './VendorsTable';
import VendorActionsBar from './VendorActionsBar';
import VendorsViewsTabs from './VendorViewsTabs';

import withVendors from './withVendors';
import withVendorActions from './withVendorActions';
import withResourceActions from 'containers/Resources/withResourcesActions';
import withViewsActions from 'containers/Views/withViewsActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

function VendorsList({
  // #withDashboardActions
  changePageTitle,

  // #withResourceActions
  requestFetchResourceViews,

  // #withVendors
  vendorTableQuery,

  // #withVendorActions
  requestDeleteVender,
  requestFetchVendorsTable,
}) {
  const [deleteVendor, setDeleteVendor] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  const { formatMessage } = useIntl();
  const history = useHistory();

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'vendors_list' }));
  }, [changePageTitle, formatMessage]);

  // Fetch vendors resource views and fields.
  const fetchResourceViews = useQuery(
    ['resource-views', 'vendors'],
    (key, resourceName) => requestFetchResourceViews(resourceName),
  );

  // Handle fetch vendors data table
  const fetchVendors = useQuery(
    ['vendors-table', vendorTableQuery],
    (key, query) => requestFetchVendorsTable({ ...query }),
  );

  // Handle Edit vendor data table
  const handleEditVendor = useCallback(
    (vendor) => {
      history.push(`/vendors/${vendor.id}/edit`);
    },
    [history],
  );
  // Handle click delete vendor.
  const handleDeleteVendor = useCallback(
    (vendor) => {
      setDeleteVendor(vendor);
    },
    [setDeleteVendor],
  );

  // Handle cancel delete the vendor.
  const handleCancelDeleteVendor = useCallback(() => {
    setDeleteVendor(false);
  }, [setDeleteVendor]);

  // Transform API errors in toasts messages.
  const transformErrors = useCallback((errors) => {
    if (errors.some((e) => e.type === 'VENDOR.HAS.BILLS')) {
      AppToaster.show({
        message: formatMessage({
          id: 'vendor_has_bills',
        }),
        intent: Intent.DANGER,
      });
    }
  }, []);

  // handle confirm delete vendor.
  const handleConfirmDeleteVendor = useCallback(() => {
    requestDeleteVender(deleteVendor.id)
      .then(() => {
        setDeleteVendor(false);
        AppToaster.show({
          message: formatMessage({
            id: 'the_vendor_has_been_successfully_deleted',
          }),
          intent: Intent.SUCCESS,
        });
      })
      .catch((errors) => {
        setDeleteVendor(false);
        transformErrors(errors);
      });
  }, [requestDeleteVender, deleteVendor, formatMessage]);

  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback(
    (vendor) => {
      setSelectedRows(vendor);
    },
    [setSelectedRows],
  );

  useEffect(() => {
    if (tableLoading && !fetchVendors.isFetching) {
      setTableLoading(false);
    }
  }, [tableLoading, fetchVendors.isFetching]);

  return (
    <DashboardInsider
      loading={fetchResourceViews.isFetching}
      name={'customers-list'}
    >
      <VendorActionsBar selectedRows={selectedRows} />
      <DashboardPageContent>
        <Switch>
          <Route
            exact={true}
            path={['/vendors/:custom_view_id/custom_view', '/vendors']}
          >
            <VendorsViewsTabs />
            <VendorsTable
              onDeleteVendor={handleDeleteVendor}
              onEditVendor={handleEditVendor}
              onSelectedRowsChange={handleSelectedRowsChange}
            />
          </Route>
        </Switch>
        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'delete'} />}
          icon="trash"
          intent={Intent.DANGER}
          isOpen={deleteVendor}
          onCancel={handleCancelDeleteVendor}
          onConfirm={handleConfirmDeleteVendor}
        >
          <p>
            <FormattedHTMLMessage
              id={'once_delete_this_vendor_you_will_able_to_restore_it'}
            />
          </p>
        </Alert>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withResourceActions,
  withVendorActions,
  withDashboardActions,
  withViewsActions,
  withVendors(({ vendorTableQuery }) => ({ vendorTableQuery })),
)(VendorsList);
