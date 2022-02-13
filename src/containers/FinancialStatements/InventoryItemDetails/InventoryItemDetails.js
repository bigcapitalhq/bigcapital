import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { FinancialStatement } from 'components';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import InventoryItemDetailsActionsBar from './InventoryItemDetailsActionsBar';
import InventoryItemDetailsHeader from './InventoryItemDetailsHeader';

import withInventoryItemDetailsActions from './withInventoryItemDetailsActions';
import withCurrentOrganization from '../../../containers/Organization/withCurrentOrganization';
import { InventoryItemDetailsProvider } from './InventoryItemDetailsProvider';
import {
  InventoryItemDetailsLoadingBar,
  InventoryItemDetailsAlerts,
} from './components';

import { compose } from 'utils';
import { InventoryItemDetailsBody } from './InventoryItemDetailsBody';

/**
 * inventory item details.
 */
function InventoryItemDetails({
  // #withSettings
  organizationName,

  //#withInventoryItemDetailsActions
  toggleInventoryItemDetailsFilterDrawer: toggleFilterDrawer,
}) {
  const [filter, setFilter] = useState({
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
  });
  // Handle filter submit.
  const handleFilterSubmit = (filter) => {
    const _filter = {
      ...filter,
      fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
      toDate: moment(filter.toDate).format('YYYY-MM-DD'),
    };
    setFilter({ ..._filter });
  };

  // Handle number format submit.
  const handleNumberFormatSubmit = (values) => {
    setFilter({
      ...filter,
      numberFormat: values,
    });
  };

  useEffect(() => () => toggleFilterDrawer(false), [toggleFilterDrawer]);

  return (
    <InventoryItemDetailsProvider filter={filter}>
      <InventoryItemDetailsActionsBar
        numberFormat={filter.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <InventoryItemDetailsLoadingBar />
      <InventoryItemDetailsAlerts />

      <DashboardPageContent>
        <FinancialStatement>
          <InventoryItemDetailsHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit}
          />
          <InventoryItemDetailsBody />
        </FinancialStatement>
      </DashboardPageContent>
    </InventoryItemDetailsProvider>
  );
}

export default compose(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
  withInventoryItemDetailsActions,
)(InventoryItemDetails);
