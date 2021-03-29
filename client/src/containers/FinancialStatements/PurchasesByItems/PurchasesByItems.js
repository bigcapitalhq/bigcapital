import React, { useEffect, useState, useCallback } from 'react';
import moment from 'moment';

import 'style/pages/FinancialStatements/PurchasesByItems.scss';

import { PurchasesByItemsProvider } from './PurchasesByItemsProvider';
import PurchasesByItemsActionsBar from './PurchasesByItemsActionsBar';
import PurchasesByItemsHeader from './PurchasesByItemsHeader';
import PurchasesByItemsTable from './PurchasesByItemsTable';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import { PurchasesByItemsLoadingBar } from './components';

import withPurchasesByItemsActions from './withPurchasesByItemsActions';
import withSettings from 'containers/Settings/withSettings';
import { compose } from 'utils';

/**
 * Purchases by items.
 */
function PurchasesByItems({
  // #withPreferences
  organizationName,

  // #withPurchasesByItemsActions
  togglePurchasesByItemsFilterDrawer,
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
        <div className="financial-statement">
          <PurchasesByItemsHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit}
          />
        </div>
        <div className="financial-statement__body">
          <PurchasesByItemsTable companyName={organizationName} />
        </div>
      </DashboardPageContent>
    </PurchasesByItemsProvider>
  );
}

export default compose(
  withPurchasesByItemsActions,
  withSettings(({ organizationSettings }) => ({
    organizationName: organizationSettings.name,
  })),
)(PurchasesByItems);
