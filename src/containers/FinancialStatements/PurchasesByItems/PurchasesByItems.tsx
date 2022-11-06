// @ts-nocheck
import React, { useEffect, useState, useCallback } from 'react';
import moment from 'moment';

import PurchasesByItemsActionsBar from './PurchasesByItemsActionsBar';
import PurchasesByItemsHeader from './PurchasesByItemsHeader';

import { FinancialStatement, DashboardPageContent } from '@/components';
import { PurchasesByItemsLoadingBar } from './components';
import { PurchasesByItemsProvider } from './PurchasesByItemsProvider';
import { PurchasesByItemsBody } from './PurchasesByItemsBody';
import { getDefaultPurchasesByItemsQuery } from './utils';
import { compose } from '@/utils';

import withPurchasesByItemsActions from './withPurchasesByItemsActions';

/**
 * Purchases by items.
 */
function PurchasesByItems({
  // #withPurchasesByItemsActions
  togglePurchasesByItemsFilterDrawer,
}) {
  const [filter, setFilter] = useState({
    ...getDefaultPurchasesByItemsQuery(),
  });

  // Handle filter form submit.
  const handleFilterSubmit = useCallback(
    (filter) => {
      const parsedFilter = {
        ...filter,
        fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
        toDate: moment(filter.toDate).format('YYYY-MM-DD'),
      };
      setFilter(parsedFilter);
    },
    [setFilter],
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
    <PurchasesByItemsProvider query={filter}>
      <PurchasesByItemsActionsBar
        numberFormat={filter.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <PurchasesByItemsLoadingBar />

      <DashboardPageContent>
        <FinancialStatement>
          <PurchasesByItemsHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit}
          />
          <PurchasesByItemsBody />
        </FinancialStatement>
      </DashboardPageContent>
    </PurchasesByItemsProvider>
  );
}

export default compose(withPurchasesByItemsActions)(PurchasesByItems);
