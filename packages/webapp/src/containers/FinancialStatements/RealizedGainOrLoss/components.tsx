import React from 'react';
import { FinancialLoadingBar } from '../FinancialLoadingBar';
import { If } from '@/components';

export function RealizedGainOrLossLoadingBar() {
  return (
    <If condition={false}>
      <FinancialLoadingBar />
    </If>
  );
}
