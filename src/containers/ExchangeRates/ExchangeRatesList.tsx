import React from 'react';

import { DashboardContentTable, DashboardPageContent } from '@/components';

import ExchangeRateTable from './ExchangeRateTable';
import ExchangeRateActionsBar from './ExchangeRateActionsBar';

import { ExchangeRatesProvider } from './ExchangeRatesProvider';
import withExchangeRates from './withExchangeRates';
import { transformTableStateToQuery, compose } from '@/utils';

/**
 * Exchange Rates list.
 */
function ExchangeRatesList({
  // #withExchangeRates
  exchangeRatesTableState,
}) {
  return (
    <ExchangeRatesProvider
      query={transformTableStateToQuery(exchangeRatesTableState)}
    >
      <ExchangeRateActionsBar />

      <DashboardPageContent>
        <DashboardContentTable>
          <ExchangeRateTable />
        </DashboardContentTable>
      </DashboardPageContent>
    </ExchangeRatesProvider>
  );
}
export default compose(
  withExchangeRates(({ exchangeRatesTableState }) => ({
    exchangeRatesTableState,
  })),
)(ExchangeRatesList);