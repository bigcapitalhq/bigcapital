// @ts-nocheck
import React from 'react';

import { useARAgingSummaryContext } from './ARAgingSummaryProvider';
import { If, FormattedMessage as T } from '@/components';
import FinancialLoadingBar from '../FinancialLoadingBar';
import { agingSummaryDynamicColumns } from '../AgingSummary/dynamicColumns';

/**
 * Retrieve AR aging summary columns.
 */
export const useARAgingSummaryColumns = () => {
  const {
    ARAgingSummary: { table },
  } = useARAgingSummaryContext();

  return agingSummaryDynamicColumns(table.columns, table.rows);
};

/**
 * A/R aging summary sheet loading bar.
 */
export function ARAgingSummarySheetLoadingBar() {
  const { isARAgingFetching } = useARAgingSummaryContext();

  return (
    <If condition={isARAgingFetching}>
      <FinancialLoadingBar />
    </If>
  );
}
