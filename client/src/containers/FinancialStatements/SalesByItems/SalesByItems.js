import React, { useEffect, useState, useCallback } from 'react';
import moment from 'moment';


import 'style/pages/FinancialStatements/SalesAndPurchasesSheet.scss';

import { SalesByItemProvider } from './SalesByItemProvider';
import SalesByItemsActionsBar from './SalesByItemsActionsBar';
import SalesByItemsHeader from './SalesByItemsHeader';
import SalesByItemsTable from './SalesByItemsTable';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import { SalesByItemsLoadingBar } from './components';

import withSalesByItemsActions from './withSalesByItemsActions';
import withSettings from 'containers/Settings/withSettings';

import { compose } from 'utils';

/**
 * Sales by items.
 */
function SalesByItems({
  // #withPreferences
  organizationName,

  // #withSellsByItemsActions
  toggleSalesByItemsFilterDrawer,
}) {
  const [filter, setFilter] = useState({
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
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
        <div class="financial-statement financial-statement--sales-by-items">
          <SalesByItemsHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit}
          />
          <div class="financial-statement__body">
            <SalesByItemsTable companyName={organizationName} />
          </div>
        </div>
      </DashboardPageContent>
    </SalesByItemProvider>
  );
}

export default compose(
  withSalesByItemsActions,
  withSettings(({ organizationSettings }) => ({
    organizationName: organizationSettings.name,
  })),
)(SalesByItems);
