import React from 'react';
import { Button } from '@blueprintjs/core';
import { Icon, If } from '@/components';
import { FormattedMessage as T } from '@/components';

import { useRealizedGainOrLossContext } from './RealizedGainOrLossProvider';
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
