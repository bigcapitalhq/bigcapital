import React, { useEffect, useCallback } from 'react';
import moment from 'moment';
import { DashboardPageContent } from '@/components';
import { InventoryValuationActionsBar } from './InventoryValuationActionsBar';
import { InventoryValuationHeader } from './InventoryValuationHeader';
import { InventoryValuationProvider } from './InventoryValuationProvider';
import { InventoryValuationBody } from './InventoryValuationBody';
import { InventoryValuationLoadingBar } from './components';
import { useInventoryValuationQuery } from './utils';
import {
  withInventoryValuationActions,
  WithInventoryValuationActionsProps,
} from './withInventoryValuationActions';
import {
  withCurrentOrganization,
  WithCurrentOrganizationProps,
} from '@/containers/Organization/withCurrentOrganization';
import { InventoryValuationDialogs } from './InventoryValuationDialogs';
import { flow } from 'fp-ts/function';

interface InventoryValuationProps {
  toggleInventoryValuationFilterDrawer: WithInventoryValuationActionsProps['toggleInventoryValuationFilterDrawer'];
  organizationName: WithCurrentOrganizationProps['organization']['name'];
}

/**
 * Inventory valuation.
 */
function InventoryValuationInner({
  // #withInventoryValuationActions
  toggleInventoryValuationFilterDrawer,
}: InventoryValuationProps) {
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
        numberFormat={query.numberFormat as Record<string, unknown>}
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

export const InventoryValuation = flow(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
  withInventoryValuationActions,
)(InventoryValuationInner);
