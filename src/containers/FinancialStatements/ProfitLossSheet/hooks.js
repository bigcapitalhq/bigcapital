import React from 'react';

import { dynamicColumns } from './dynamicColumns';

import { useProfitLossSheetContext } from './ProfitLossProvider';
import { useAppIntlContext } from '../../../components/AppIntlProvider';

/**
 * Retrieves the profit/loss table columns.
 * @returns
 */
export const useProfitLossSheetColumns = () => {
  const {
    profitLossSheet: { table },
  } = useProfitLossSheetContext();

  const { direction } = useAppIntlContext();

  return React.useMemo(
    () => dynamicColumns(direction, table.columns, table.rows),
    [direction, table],
  );
};
