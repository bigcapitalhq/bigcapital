// @ts-nocheck
import React, { useEffect, useState, useCallback } from 'react';
import moment from 'moment';

import { SalesByItemsBody } from './SalesByItemsBody';
import { SalesByItemProvider } from './SalesByItemProvider';
import { SalesByItemsLoadingBar } from './components';
import { FinancialStatement, DashboardPageContent } from '@/components';
import SalesByItemsActionsBar from './SalesByItemsActionsBar';
import SalesByItemsHeader from './SalesByItemsHeader';

import withSalesByItemsActions from './withSalesByItemsActions';

import { getDefaultSalesByItemsQuery } from './utils';
import { compose } from '@/utils';

/**
 * Sales by items.
 */
function SalesByItems({
  // #withSellsByItemsActions
  toggleSalesByItemsFilterDrawer,
}) {
  const [filter, setFilter] = useState({
    ...getDefaultSalesByItemsQuery(),
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
      toggleSalesByItemsFilterDrawer(false);
    },
    [toggleSalesByItemsFilterDrawer],
  );

  return (
    <SalesByItemProvider query={filter}>
      <SalesByItemsActionsBar
        numberFormat={filter.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <SalesByItemsLoadingBar />

      <DashboardPageContent>
        <FinancialStatement>
          <SalesByItemsHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit}
          />
          <SalesByItemsBody />
        </FinancialStatement>
      </DashboardPageContent>
    </SalesByItemProvider>
  );
}

export default compose(withSalesByItemsActions)(SalesByItems);
