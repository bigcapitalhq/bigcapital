import React, { useEffect, useState, useCallback } from 'react';
import moment from 'moment';

import { InventoryValuationProvider } from './InventoryValuationProvider';
import InventoryValuationActionsBar from './InventoryValuationActionsBar';
import InventoryValuationHeader from './InventoryValuationHeader';
import { InventoryValuationBody } from './InventoryValuationBody';

import DashboardPageContent from '@/components/Dashboard/DashboardPageContent';
import { InventoryValuationLoadingBar } from './components';
import withInventoryValuationActions from './withInventoryValuationActions';
import withCurrentOrganization from '../../../containers/Organization/withCurrentOrganization';

import { useInventoryValuationQuery } from './utils';
import { compose } from '@/utils';

/**
 * Inventory valuation.
 */
function InventoryValuation({
  // #withInventoryValuationActions
  toggleInventoryValuationFilterDrawer,
}) {
  const { query, setLocationQuery } = useInventoryValuationQuery();

  // Handle filter form submit.
  const handleFilterSubmit = useCallback(
    (filter) => {
      const newFilter = {
        ...filter,
        asDate: moment(filter.asDate).format('YYYY-MM-DD'),
      };
      setLocationQuery(newFilter);
    },
    [setLocationQuery],
  );
  // Handle number format form submit.
  const handleNumberFormatSubmit = (numberFormat) => {
    setLocationQuery({
      ...query,
      numberFormat,
    });
  };
  // Hide the filter drawer once the page unmount.
  useEffect(
    () => () => {
      toggleInventoryValuationFilterDrawer(false);
    },
    [toggleInventoryValuationFilterDrawer],
  );

  return (
    <InventoryValuationProvider query={query}>
      <InventoryValuationActionsBar
        numberFormat={query.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <InventoryValuationLoadingBar />

      <DashboardPageContent>
        <InventoryValuationHeader
          pageFilter={query}
          onSubmitFilter={handleFilterSubmit}
        />
        <InventoryValuationBody />
      </DashboardPageContent>
    </InventoryValuationProvider>
  );
}

export default compose(
  withInventoryValuationActions,
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(InventoryValuation);
