import React, { useEffect, useState, useCallback } from 'react';
import moment from 'moment';

import { InventoryValuationProvider } from './InventoryValuationProvider';
import InventoryValuationActionsBar from './InventoryValuationActionsBar';
import InventoryValuationHeader from './InventoryValuationHeader';
import { InventoryValuationBody } from './InventoryValuationBody';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import { InventoryValuationLoadingBar } from './components';
import withInventoryValuationActions from './withInventoryValuationActions';
import withCurrentOrganization from '../../../containers/Organization/withCurrentOrganization';

import { compose } from 'utils';

/**
 * Inventory valuation.
 */
function InventoryValuation({
  // #withPreferences
  organizationName,

  // #withInventoryValuationActions
  toggleInventoryValuationFilterDrawer,
}) {
  const [filter, setFilter] = useState({
    asDate: moment().endOf('day').format('YYYY-MM-DD'),
    filterByOption: 'with-transactions',
  });

  // Handle filter form submit.
  const handleFilterSubmit = useCallback((filter) => {
    const _filter = {
      ...filter,
      asDate: moment(filter.asDate).format('YYYY-MM-DD'),
    };
    setFilter(_filter);
  }, []);

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
      toggleInventoryValuationFilterDrawer(false);
    },
    [toggleInventoryValuationFilterDrawer],
  );

  return (
    <InventoryValuationProvider query={filter}>
      <InventoryValuationActionsBar
        numberFormat={filter.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <InventoryValuationLoadingBar />

      <DashboardPageContent>
        <InventoryValuationHeader
          pageFilter={filter}
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
