// @ts-nocheck
import React from 'react';
import FinancialStatementDateRange from '../FinancialStatementDateRange';
import RadiosAccountingBasis from '../RadiosAccountingBasis';

export function SalesTaxLiabilitySummaryHeaderGeneral() {
  return (
    <div>
      <FinancialStatementDateRange />
      <RadiosAccountingBasis key={'basis'} />
    </div>
  );
}
