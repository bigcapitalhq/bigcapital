// @ts-nocheck
import React from 'react';
import { useTrialBalanceSheetContext } from './TrialBalanceProvider';
import { trialBalancesheetDynamicColumns } from './dynamicColumns';

/**
 * Retrieves the trial balance sheet columns.
 */
export const useTrialBalanceSheetTableColumns = () => {
  const {
    trialBalanceSheet: { table },
  } = useTrialBalanceSheetContext();

  return React.useMemo(
    () => trialBalancesheetDynamicColumns(table.columns, table.rows),
    [table],
  );
};
