import React from 'react';
import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import RadiosAccountingBasis from '../RadiosAccountingBasis';
import FinancialAccountsFilter from '../FinancialAccountsFilter';

/**
 * Trial balance sheet - Drawer header - General panel.
 */
export default function TrialBalanceSheetHeaderGeneralPanel({

}) {
  return (
    <div>
      <FinancialStatementDateRange />
      <FinancialAccountsFilter initialSelectedItem={'all-accounts'} />
      <RadiosAccountingBasis />
    </div>
  );
}
