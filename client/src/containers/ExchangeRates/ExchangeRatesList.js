import React from 'react';

import { DashboardContentTable, DashboardPageContent } from 'components';

import ExchangeRateTable from './ExchangeRateTable';
import ExchangeRateActionsBar from './ExchangeRateActionsBar';

import { ExchangeRatesProvider } from './ExchangeRatesProvider';
import ExchangeRatesAlerts from './ExchangeRatesAlerts';

/**
 * Exchange Rates list.
 */
export default function ExchangeRatesList() {
  return (
    <ExchangeRatesProvider>
      <ExchangeRateActionsBar />

      <DashboardPageContent>
        <DashboardContentTable>
          <ExchangeRateTable />
        </DashboardContentTable>
      </DashboardPageContent>
      <ExchangeRatesAlerts />
    </ExchangeRatesProvider>
  );
}
