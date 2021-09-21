import React from 'react';

import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import SelectDisplayColumnsBy from '../SelectDisplayColumnsBy';
import RadiosAccountingBasis from '../RadiosAccountingBasis';
import FinancialAccountsFilter from '../FinancialAccountsFilter';

/**
 * Profit/Loss sheet - Drawer header - General panel.
 */
export default function ProfitLossSheetHeaderGeneralPane({}) {
  return (
    <div>
      <FinancialStatementDateRange />
      <SelectDisplayColumnsBy />
      <FinancialAccountsFilter initialSelectedItem={'all-accounts'} />
      <RadiosAccountingBasis key={'basis'} />
    </div>
  );
}
