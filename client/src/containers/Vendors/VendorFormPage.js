import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import { DashboardCard } from 'components';
import VendorFrom from './VendorForm';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import withVendorActions from './withVendorActions';
import withCurrenciesActions from 'containers/Currencies/withCurrenciesActions';

import { compose } from 'utils';

function VendorFormPage({
  // #withVendorActions
  requestFetchVendorsTable,
  requestFetchVendor,

  // #withCurrenciesActions
  requestFetchCurrencies,
}) {
  const { id } = useParams();
  const history = useHistory();

  // Handle fetch Currencies data table
  const fetchCurrencies = useQuery('currencies', () =>
    requestFetchCurrencies(),
  );

  // Handle fetch vendors data table
  const fetchVendors = useQuery('vendor-list', () =>
    requestFetchVendorsTable({}),
  );

  // Handle fetch vendor details.
  const fetchVendor = useQuery(
    ['vendor', id],
    (_id, vendorId) => requestFetchVendor(vendorId),
    { enabled: id && id },
  );

  const handleFormSubmit = useCallback(() => {}, []);

  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <DashboardInsider
      loading={
        fetchCurrencies.isFetching ||
        fetchVendors.isFetching ||
        fetchVendor.isFetching
      }
      name={'vendor-form'}
    >
      <DashboardCard page>
        <VendorFrom
          onFormSubmit={handleFormSubmit}
          vendorId={id}
          onCancelForm={handleCancel}
        />
      </DashboardCard>
    </DashboardInsider>
  );
}

export default compose(withCurrenciesActions, withVendorActions)(VendorFormPage);
