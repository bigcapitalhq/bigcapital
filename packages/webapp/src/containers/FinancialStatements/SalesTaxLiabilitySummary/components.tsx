// @ts-nocheck
import React from 'react';

import { useSalesTaxLiabilitySummaryContext } from './SalesTaxLiabilitySummaryBoot';
import FinancialLoadingBar from '../FinancialLoadingBar';

/**
 * Balance sheet loading bar.
 */
export function SalesTaxLiabilitySummaryLoadingBar() {
  const { isFetching } = useSalesTaxLiabilitySummaryContext();

  if (!isFetching) {
    return null;
  }
  return <FinancialLoadingBar />;
}
