// @ts-nocheck
import React from 'react';

import { If } from '@/components';

import FinancialLoadingBar from '../FinancialLoadingBar';

/**
 *  Realized Gain or Loss loading bar.
 */
export function RealizedGainOrLossLoadingBar() {
  return (
    <If condition={false}>
      <FinancialLoadingBar />
    </If>
  );
}
