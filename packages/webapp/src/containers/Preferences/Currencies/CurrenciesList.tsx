// @ts-nocheck
import React, { useEffect } from 'react';
import intl from 'react-intl-universal';

import { CurrenciesProvider } from './CurrenciesProvider';
import { CurrenciesDataTable } from './CurrenciesDataTable';

import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { flow } from 'fp-ts/function';

function CurrenciesListInner({
  // #withDashboardActions
  changePreferencesPageTitle,
}) {
  useEffect(() => {
    changePreferencesPageTitle(intl.get('currencies'));
  }, [changePreferencesPageTitle]);

  return (
    <CurrenciesProvider>
      <CurrenciesDataTable />
    </CurrenciesProvider>
  );
}

export const CurrenciesList = flow(withDashboardActions)(
  CurrenciesListInner,
);
