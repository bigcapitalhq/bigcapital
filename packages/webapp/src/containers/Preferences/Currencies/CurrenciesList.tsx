import * as FF from 'fp-ts/function';
import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { CurrenciesDataTable } from './CurrenciesDataTable';
import { CurrenciesProvider } from './CurrenciesProvider';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';

type CurrenciesListInnerProps = Pick<
  WithDashboardActionsProps,
  'changePreferencesPageTitle'
>;

function CurrenciesListInner({
  // #withDashboardActions
  changePreferencesPageTitle,
}: CurrenciesListInnerProps) {
  useEffect(() => {
    changePreferencesPageTitle(intl.get('currencies'));
  }, [changePreferencesPageTitle]);

  return (
    <CurrenciesProvider>
      <CurrenciesDataTable />
    </CurrenciesProvider>
  );
}

export const CurrenciesList = FF.pipe(
  CurrenciesListInner,
  withDashboardActions,
);
