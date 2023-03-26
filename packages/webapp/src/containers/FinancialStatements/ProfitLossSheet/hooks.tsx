// @ts-nocheck
import React from 'react';

import { dynamicColumns } from './dynamicColumns';
import { useProfitLossSheetContext } from './ProfitLossProvider';

/**
 * Retrieves the profit/loss table columns.
 * @returns 
 */
export const useProfitLossSheetColumns = () => {
  const {
    profitLossSheet: { table },
  } = useProfitLossSheetContext();

  return React.useMemo(
    () => dynamicColumns(table.columns || [], table.rows || []),
    [table],
  );
};
