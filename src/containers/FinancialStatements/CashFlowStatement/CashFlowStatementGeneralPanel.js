import React from 'react';
import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import FinancialStatementsFilter from '../FinancialStatementsFilter';
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
      <FinancialStatementsFilter initialSelectedItem={'all-accounts'} />
      <RadiosAccountingBasis key={'basis'} />
    </div>
  );
}
