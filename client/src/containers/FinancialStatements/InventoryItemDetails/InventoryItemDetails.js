import React, { useEffect, useState } from 'react';
import moment from 'moment';
import 'style/pages/FinancialStatements/InventoryItemDetails.scss';

import { FinancialStatement } from 'components';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import InventoryItemDetailsActionsBar from './InventoryItemDetailsActionsBar';
import InventoryItemDetailsHeader from './InventoryItemDetailsHeader';
import InventoryItemDetailsTable from './InventoryItemDetailsTable';

import withInventoryItemDetailsActions from './withInventoryItemDetailsActions';
import withSettings from 'containers/Settings/withSettings';
import { InventoryItemDetailsProvider } from './InventoryItemDetailsProvider';
import {
  InventoryItemDetailsLoadingBar,
  InventoryItemDetailsAlerts,
} from './components';

import { compose } from 'utils';

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
          <div className={'financial-statement--inventory-details'}>
            <InventoryItemDetailsHeader
              pageFilter={filter}
              onSubmitFilter={handleFilterSubmit}
            />
          </div>
          <div class="financial-statement__body">
            <InventoryItemDetailsTable companyName={organizationName} />
          </div>
        </FinancialStatement>
      </DashboardPageContent>
    </InventoryItemDetailsProvider>
  );
}

export default compose(
  withSettings(({ organizationSettings }) => ({
    organizationName: organizationSettings?.name,
  })),
  withInventoryItemDetailsActions,
)(InventoryItemDetails);
