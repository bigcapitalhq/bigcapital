import React from 'react';
import { FinancialLoadingBar } from '../FinancialLoadingBar';
import { If } from '@/components';

export function UnrealizedGainOrLossLoadingBar() {
  return (
    <If condition={false}>
      <FinancialLoadingBar />
    </If>
  );
}
