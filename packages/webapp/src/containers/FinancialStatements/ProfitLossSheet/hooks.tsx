import React from 'react';
import { dynamicColumns } from './dynamicColumns';
import { useProfitLossSheetContext } from './ProfitLossProvider';

export const useProfitLossSheetColumns = () => {
  const { profitLossSheet } = useProfitLossSheetContext();

  return React.useMemo(
    () =>
      dynamicColumns(
        profitLossSheet?.table?.columns ?? [],
        profitLossSheet?.table?.rows ?? [],
      ),
    [profitLossSheet],
  );
};
