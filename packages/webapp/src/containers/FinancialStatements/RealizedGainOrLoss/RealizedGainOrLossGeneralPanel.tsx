import React from 'react';
import { FinancialStatementDateRange } from '../FinancialStatementDateRange';
import { SelectDisplayColumnsBy } from '../SelectDisplayColumnsBy';

export function RealizedGainOrLossGeneralPanel() {
  return (
    <div>
      <FinancialStatementDateRange />
      <SelectDisplayColumnsBy />
    </div>
  );
}
