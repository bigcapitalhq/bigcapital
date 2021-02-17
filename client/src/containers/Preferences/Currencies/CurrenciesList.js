import React, { useEffect } from 'react';

import { FormattedMessage as T, useIntl } from 'react-intl';

import { CurrenciesProvider } from './CurrenciesProvider';
import CurrenciesDataTable from './CurrenciesDataTable';
import CurrenciesAlerts from './CurrenciesAlerts';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

function CurrenciesList({
  // #withDashboardActions
  changePreferencesPageTitle,
}) {
  const { formatMessage } = useIntl();

  useEffect(() => {
    changePreferencesPageTitle(formatMessage({ id: 'currencies' }));
  }, [changePreferencesPageTitle, formatMessage]);

  return (
    <CurrenciesProvider>
      <CurrenciesDataTable />
      <CurrenciesAlerts />
    </CurrenciesProvider>
  );
}

export default compose(withDashboardActions)(CurrenciesList);
