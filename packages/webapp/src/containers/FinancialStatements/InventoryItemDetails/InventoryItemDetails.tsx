// @ts-nocheck
import React, { useEffect } from 'react';
import moment from 'moment';

import { FinancialStatement, DashboardPageContent } from '@/components';

import InventoryItemDetailsActionsBar from './InventoryItemDetailsActionsBar';
import InventoryItemDetailsHeader from './InventoryItemDetailsHeader';

import withInventoryItemDetailsActions from './withInventoryItemDetailsActions';
import { InventoryItemDetailsProvider } from './InventoryItemDetailsProvider';
import {
  InventoryItemDetailsLoadingBar,
  InventoryItemDetailsAlerts,
} from './components';

import { InventoryItemDetailsBody } from './InventoryItemDetailsBody';
import { InventoryItemDetailsDialogs } from './InventoryItemDetailsDialogs';
import { useInventoryValuationQuery } from './utils2';
import { compose } from '@/utils';

/**
 * inventory item details.
 */
function InventoryItemDetails({
  //#withInventoryItemDetailsActions
  toggleInventoryItemDetailsFilterDrawer: toggleFilterDrawer,
}) {
  const { query, setLocationQuery } = useInventoryValuationQuery();

  // Handle filter submit.
  const handleFilterSubmit = (filter) => {
    const _filter = {
      ...filter,
      fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
      toDate: moment(filter.toDate).format('YYYY-MM-DD'),
    };
    setLocationQuery({ ..._filter });
  };
  // Handle number format submit.
  const handleNumberFormatSubmit = (values) => {
    setLocationQuery({
      ...query,
      numberFormat: values,
    });
  };
  // Close the report header once the browser leave the page.
  useEffect(() => () => toggleFilterDrawer(false), [toggleFilterDrawer]);

  return (
    <InventoryItemDetailsProvider query={query}>
      <InventoryItemDetailsActionsBar
        numberFormat={query.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <InventoryItemDetailsLoadingBar />
      <InventoryItemDetailsAlerts />

      <DashboardPageContent>
        <FinancialStatement>
          <InventoryItemDetailsHeader
            pageFilter={query}
            onSubmitFilter={handleFilterSubmit}
          />
          <InventoryItemDetailsBody />
        </FinancialStatement>
      </DashboardPageContent>

      <InventoryItemDetailsDialogs />
    </InventoryItemDetailsProvider>
  );
}

export default compose(withInventoryItemDetailsActions)(InventoryItemDetails);
