import moment from 'moment';
import React, { useEffect, useCallback } from 'react';
import { InventoryValuationLoadingBar } from './components';
import { InventoryValuationActionsBar } from './InventoryValuationActionsBar';
import { InventoryValuationBody } from './InventoryValuationBody';
import { InventoryValuationDialogs } from './InventoryValuationDialogs';
import { InventoryValuationHeader } from './InventoryValuationHeader';
import { InventoryValuationProvider } from './InventoryValuationProvider';
import { useInventoryValuationQuery } from './utils';
import {
  withInventoryValuationActions,
  WithInventoryValuationActionsProps,
} from './withInventoryValuationActions';
import { DashboardPageContent } from '@/components';
import { useCurrentOrganizationName } from '@/hooks/query';
import { compose } from '@/utils';

interface InventoryValuationProps {
  toggleInventoryValuationFilterDrawer: WithInventoryValuationActionsProps['toggleInventoryValuationFilterDrawer'];
}

/**
 * Inventory valuation.
 */
function InventoryValuationInner({
  // #withInventoryValuationActions
  toggleInventoryValuationFilterDrawer,
}: InventoryValuationProps) {
  const organizationName = useCurrentOrganizationName();
  const { query, setLocationQuery } = useInventoryValuationQuery();

  // Handle filter form submit.
  const handleFilterSubmit = useCallback(
    (filter: Record<string, unknown>) => {
      const newFilter = {
        ...filter,
        asDate: moment(filter.asDate as string).format('YYYY-MM-DD'),
      };
      setLocationQuery(newFilter);
    },
    [setLocationQuery],
  );
  // Handle number format form submit.
  const handleNumberFormatSubmit = (numberFormat: Record<string, unknown>) => {
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

      <InventoryValuationDialogs />
    </InventoryValuationProvider>
  );
}

export const InventoryValuation = compose(withInventoryValuationActions)(
  InventoryValuationInner,
);
