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

  // #withVendors
  vendorTableQuery,

  // #withVendorActions
  requestDeleteVender,
  requestFetchVendorsTable,
  addVendorsTableQueries,
}) {
  const [deleteVendor, setDeleteVendor] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  const { formatMessage } = useIntl();
  const history = useHistory();

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'vendors_list' }));
  }, [changePageTitle, formatMessage]);

  // Handle fetch customers data table
  const fetchVendors = useQuery(['vendors-table', vendorTableQuery], () =>
    requestFetchVendorsTable(),
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
  }, [tableLoading, fetchVendors]);

  return (
    <DashboardInsider name={'vendors-list'}>
      <VendorActionsBar selectedRows={selectedRows} />
      <DashboardPageContent>
        <Switch>
          <Route
            exact={true}
            // path={}
          >
            <VendorsViewsTabs />
            <VendorsTable
              loading={fetchVendors.isFetching}
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
  withVendorActions,
  withDashboardActions,
  withVendors(({ vendorTableQuery }) => ({ vendorTableQuery })),
)(VendorsList);
