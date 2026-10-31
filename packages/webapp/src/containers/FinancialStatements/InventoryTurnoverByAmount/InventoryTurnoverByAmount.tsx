import * as FF from 'fp-ts/function';
import moment from 'moment';
import React, { useEffect } from 'react';
import { InventoryTurnoverByAmountLoadingBar } from './components';
import { InventoryTurnoverByAmountActionsBar } from './InventoryTurnoverByAmountActionsBar';
import { InventoryTurnoverByAmountBody } from './InventoryTurnoverByAmountBody';
import { InventoryTurnoverByAmountDialogs } from './InventoryTurnoverByAmountDialogs';
import { InventoryTurnoverByAmountHeader } from './InventoryTurnoverByAmountHeader';
import { InventoryTurnoverByAmountProvider } from './InventoryTurnoverByAmountProvider';
import {
  getInventoryTurnoverByAmountQuery,
  useInventoryTurnoverByAmountQuery,
} from './utils';
import {
  withInventoryTurnoverByAmountActions,
  WithInventoryTurnoverByAmountActionsProps,
} from './withInventoryTurnoverByAmountActions';
import { DashboardPageContent, FinancialStatement } from '@/components';

interface InventoryTurnoverByAmountProps {
  toggleInventoryTurnoverByAmountFilterDrawer: WithInventoryTurnoverByAmountActionsProps['toggleInventoryTurnoverByAmountFilterDrawer'];
}

/**
 * Inventory turnover by amount report page.
 */
function InventoryTurnoverByAmountInner({
  // #withInventoryTurnoverByAmountActions
  toggleInventoryTurnoverByAmountFilterDrawer,
}: InventoryTurnoverByAmountProps) {
  const { query, setLocationQuery } = useInventoryTurnoverByAmountQuery();

  const handleFilterSubmit = (filter: Record<string, unknown>) => {
    const newFilter = {
      ...filter,
      fromDate: moment(filter.fromDate as string).format('YYYY-MM-DD'),
      toDate: moment(filter.toDate as string).format('YYYY-MM-DD'),
    };
    setLocationQuery(newFilter);
  };

  const handleNumberFormatSubmit = (numberFormat: Record<string, unknown>) => {
    setLocationQuery({
      ...query,
      numberFormat,
    });
  };

  useEffect(
    () => () => {
      toggleInventoryTurnoverByAmountFilterDrawer(false);
    },
    [toggleInventoryTurnoverByAmountFilterDrawer],
  );

  return (
    <InventoryTurnoverByAmountProvider query={query}>
      <InventoryTurnoverByAmountActionsBar
        numberFormat={query.numberFormat ?? {}}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <InventoryTurnoverByAmountLoadingBar />

      <DashboardPageContent>
        <FinancialStatement>
          <InventoryTurnoverByAmountHeader
            pageFilter={
              query as ReturnType<typeof getInventoryTurnoverByAmountQuery>
            }
            onSubmitFilter={handleFilterSubmit}
          />
          <InventoryTurnoverByAmountBody />
        </FinancialStatement>
      </DashboardPageContent>

      <InventoryTurnoverByAmountDialogs />
    </InventoryTurnoverByAmountProvider>
  );
}

export const InventoryTurnoverByAmount = FF.pipe(
  InventoryTurnoverByAmountInner,
  withInventoryTurnoverByAmountActions,
);
