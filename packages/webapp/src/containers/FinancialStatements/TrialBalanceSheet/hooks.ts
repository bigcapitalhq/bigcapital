import React from 'react';
import { trialBalancesheetDynamicColumns } from './dynamicColumns';
import { useTrialBalanceSheetContext } from './TrialBalanceProvider';

/**
 * Retrieves the trial balance sheet columns.
 */
export const useTrialBalanceSheetTableColumns = () => {
  const { trialBalanceSheet } = useTrialBalanceSheetContext();

  const table = (trialBalanceSheet as any)?.table;

  return React.useMemo(
    () => trialBalancesheetDynamicColumns(table?.columns, table?.rows),
    [table],
  );
};
