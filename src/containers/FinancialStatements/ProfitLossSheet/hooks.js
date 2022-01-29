import React from 'react';
import { dynamicColumns } from './utils';
import { useProfitLossSheetContext } from './ProfitLossProvider';

export const useProfitLossSheetColumns = () => {
  const {
    profitLossSheet: { table },
  } = useProfitLossSheetContext();

  return React.useMemo(
    () => dynamicColumns(table.columns || [], table.rows || []),
    [table],
  );
};
