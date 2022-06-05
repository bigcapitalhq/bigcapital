import React from 'react';
import { Button } from '@blueprintjs/core';
import { Icon, If } from 'components';
import { FormattedMessage as T } from 'components';

import { useUnrealizedGainOrLossContext } from './UnrealizedGainOrLossProvider';
import FinancialLoadingBar from '../FinancialLoadingBar';

/**
 * Unrealized Gain or Loss loading bar.
 */
export function UnrealizedGainOrLossLoadingBar() {
  return (
    <If condition={false}>
      <FinancialLoadingBar />
    </If>
  );
}
