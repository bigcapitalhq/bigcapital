import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import VendorFrom from './VendorForm';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import withVendorActions from './withVendorActions';
import withCurrenciesActions from 'containers/Currencies/withCurrenciesActions';

import { compose } from 'utils';

function Vendor({
  // #withVendorActions
  requestFetchVendorsTable,
  requsetFetchVendor,

  // #wihtCurrenciesActions
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
    (_id, vendorId) => requsetFetchVendor(vendorId),
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
      <VendorFrom
        onFormSubmit={handleFormSubmit}
        vendorId={id}
        onCancelForm={handleCancel}
      />
    </DashboardInsider>
  );
}

export default compose(withCurrenciesActions, withVendorActions)(Vendor);
