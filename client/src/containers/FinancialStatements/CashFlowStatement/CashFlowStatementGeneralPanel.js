import React from 'react';
import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import FinancialAccountsFilter from '../FinancialAccountsFilter';
import RadiosAccountingBasis from '../RadiosAccountingBasis';
import SelectDisplayColumnsBy from '../SelectDisplayColumnsBy';

/**
 * Cash flow statement header - General panel.
 */

export default function CashFlowStatementHeaderGeneralPanel() {
  return (
    <div>
      <FinancialStatementDateRange />
      <SelectDisplayColumnsBy />
      <FinancialAccountsFilter initialSelectedItem={'all-accounts'} />
      <RadiosAccountingBasis key={'basis'} />
    </div>
  );
}
