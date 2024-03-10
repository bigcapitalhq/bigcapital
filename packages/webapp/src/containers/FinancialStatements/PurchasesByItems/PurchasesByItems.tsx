// @ts-nocheck
import React, { useEffect, useCallback } from 'react';
import moment from 'moment';

import PurchasesByItemsActionsBar from './PurchasesByItemsActionsBar';
import PurchasesByItemsHeader from './PurchasesByItemsHeader';

import { FinancialStatement, DashboardPageContent } from '@/components';
import { PurchasesByItemsLoadingBar } from './components';
import { PurchasesByItemsProvider } from './PurchasesByItemsProvider';
import { PurchasesByItemsBody } from './PurchasesByItemsBody';
import { usePurchasesByItemsQuery } from './utils';
import { compose } from '@/utils';

import withPurchasesByItemsActions from './withPurchasesByItemsActions';
import { PurchasesByItemsDialogs } from './PurchasesByItemsDialogs';

/**
 * Purchases by items.
 */
function PurchasesByItems({
  // #withPurchasesByItemsActions
  togglePurchasesByItemsFilterDrawer,
}) {
  const { query, setLocationQuery } = usePurchasesByItemsQuery();

  // Handle filter form submit.
  const handleFilterSubmit = useCallback(
    (filter) => {
      const parsedFilter = {
        ...filter,
        fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
        toDate: moment(filter.toDate).format('YYYY-MM-DD'),
      };
      setLocationQuery(parsedFilter);
    },
    [setLocationQuery],
  );
  // Handle number format form submit.
  const handleNumberFormatSubmit = (numberFormat) => {
    setFilter({
      ...filter,
      numberFormat,
    });
  };
  // Hide the filter drawer once the page unmount.
  useEffect(
    () => () => {
      togglePurchasesByItemsFilterDrawer(false);
    },
    [togglePurchasesByItemsFilterDrawer],
  );

  return (
    <PurchasesByItemsProvider query={query}>
      <PurchasesByItemsActionsBar
        numberFormat={query.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <PurchasesByItemsLoadingBar />

      <DashboardPageContent>
        <FinancialStatement>
          <PurchasesByItemsHeader
            pageFilter={query}
            onSubmitFilter={handleFilterSubmit}
          />
          <PurchasesByItemsBody />
        </FinancialStatement>
      </DashboardPageContent>

      <PurchasesByItemsDialogs />
    </PurchasesByItemsProvider>
  );
}

export default compose(withPurchasesByItemsActions)(PurchasesByItems);
