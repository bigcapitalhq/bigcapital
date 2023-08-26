// @ts-nocheck
import React, { useMemo } from 'react';

import { If } from '@/components';
import FinancialLoadingBar from '../FinancialLoadingBar';
import { useAPAgingSummaryContext } from './APAgingSummaryProvider';
import { agingSummaryDynamicColumns } from '../AgingSummary/dynamicColumns';

/**
 * Retrieve AP aging summary columns.
 */
export const useAPAgingSummaryColumns = () => {
  const {
    APAgingSummary: { table },
  } = useAPAgingSummaryContext();

  return agingSummaryDynamicColumns(table.columns, table.rows);
};

/**
 * A/P aging summary sheet loading bar.
 */
export function APAgingSummarySheetLoadingBar() {
  const { isAPAgingFetching } = useAPAgingSummaryContext();

  return (
    <If condition={isAPAgingFetching}>
      <FinancialLoadingBar />
    </If>
  );
}
