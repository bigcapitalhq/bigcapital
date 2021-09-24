import React from 'react';
import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import RadiosAccountingBasis from '../RadiosAccountingBasis';
import FinancialStatementsFilter from '../FinancialStatementsFilter';

/**
 * Trial balance sheet - Drawer header - General panel.
 */
export default function TrialBalanceSheetHeaderGeneralPanel({

}) {
  return (
    <div>
      <FinancialStatementDateRange />
      <FinancialStatementsFilter initialSelectedItem={'all-accounts'} />
      <RadiosAccountingBasis />
    </div>
  );
}
