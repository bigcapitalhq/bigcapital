import React, { useEffect } from 'react';

import { FormattedMessage as T } from 'components';
import intl from 'react-intl-universal';

import { CurrenciesProvider } from './CurrenciesProvider';
import CurrenciesDataTable from './CurrenciesDataTable';
import CurrenciesAlerts from './CurrenciesAlerts';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

function CurrenciesList({
  // #withDashboardActions
  changePreferencesPageTitle,
}) {
  useEffect(() => {
    changePreferencesPageTitle(intl.get('currencies'));
  }, [changePreferencesPageTitle]);

  return (
    <CurrenciesProvider>
      <CurrenciesDataTable />
      <CurrenciesAlerts />
    </CurrenciesProvider>
  );
}

export default compose(withDashboardActions)(CurrenciesList);
