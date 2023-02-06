// @ts-nocheck
import React from 'react';

import { Row, Col } from '@/components';
import FinancialStatementDateRange from '../FinancialStatementDateRange';
import SelectDisplayColumnsBy from '../SelectDisplayColumnsBy';

/**
 * Unrealized Gain or Loss header - General panel.
 */
export default function UnrealizedGainOrLossGeneralPanel() {
  return (
    <div>
      <FinancialStatementDateRange />
      <SelectDisplayColumnsBy />
    </div>
  );
}
