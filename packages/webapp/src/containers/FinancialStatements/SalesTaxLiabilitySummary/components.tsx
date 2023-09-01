// @ts-nocheck
import React from 'react';

import { useSalesTaxLiabilitySummaryContext } from './SalesTaxLiabilitySummaryBoot';
import FinancialLoadingBar from '../FinancialLoadingBar';

/**
 * Sales tax liability summary loading bar.
 */
export function SalesTaxLiabilitySummaryLoadingBar() {
  const { isFetching } = useSalesTaxLiabilitySummaryContext();

  if (!isFetching) {
    return null;
  }
  return <FinancialLoadingBar />;
}
