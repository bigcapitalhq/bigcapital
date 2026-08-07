import moment from 'moment';
import React, { useEffect } from 'react';
import {
  InventoryItemDetailsLoadingBar,
  InventoryItemDetailsAlerts,
} from './components';
import { InventoryItemDetailsActionsBar } from './InventoryItemDetailsActionsBar';
import { InventoryItemDetailsBody } from './InventoryItemDetailsBody';
import { InventoryItemDetailsDialogs } from './InventoryItemDetailsDialogs';
import { InventoryItemDetailsHeader } from './InventoryItemDetailsHeader';
import { InventoryItemDetailsProvider } from './InventoryItemDetailsProvider';
import { useInventoryValuationQuery } from './utils2';
import {
  withInventoryItemDetailsActions,
  WithInventoryItemDetailsActionsProps,
} from './withInventoryItemDetailsActions';
import { FinancialStatement, DashboardPageContent } from '@/components';
import { compose } from '@/utils';

interface InventoryItemDetailsProps {
  toggleInventoryItemDetailsFilterDrawer: WithInventoryItemDetailsActionsProps['toggleInventoryItemDetailsFilterDrawer'];
}

/**
 * inventory item details.
 */
function InventoryItemDetailsInner({
  //#withInventoryItemDetailsActions
  toggleInventoryItemDetailsFilterDrawer: toggleFilterDrawer,
}: InventoryItemDetailsProps) {
  const { query, setLocationQuery } = useInventoryValuationQuery();

  // Handle filter submit.
  const handleFilterSubmit = (filter: Record<string, unknown>) => {
    const _filter = {
      ...filter,
      fromDate: moment(filter.fromDate as string).format('YYYY-MM-DD'),
      toDate: moment(filter.toDate as string).format('YYYY-MM-DD'),
    };
    setLocationQuery({ ..._filter });
  };
  // Handle number format submit.
  const handleNumberFormatSubmit = (values: Record<string, unknown>) => {
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
        numberFormat={query.numberFormat as Record<string, unknown>}
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

export const InventoryItemDetails = compose(withInventoryItemDetailsActions)(
  InventoryItemDetailsInner,
);
