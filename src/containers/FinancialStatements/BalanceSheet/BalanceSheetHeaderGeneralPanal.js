import React from 'react';
import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import SelectDisplayColumnsBy from '../SelectDisplayColumnsBy';
import RadiosAccountingBasis from '../RadiosAccountingBasis';
import FinancialStatementsFilter from '../FinancialStatementsFilter';

/**
 * Balance sheet header - General panal.
 */
export default function BalanceSheetHeaderGeneralTab({}) {
  return (
    <div>
      <FinancialStatementDateRange />
      <SelectDisplayColumnsBy />
      <FinancialStatementsFilter
        initialSelectedItem={'all-accounts'}
      />
      <RadiosAccountingBasis key={'basis'} />
    </div>
  );
}
