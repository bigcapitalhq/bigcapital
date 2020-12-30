import React from 'react';
import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import SelectDisplayColumnsBy from '../SelectDisplayColumnsBy';
import RadiosAccountingBasis from '../RadiosAccountingBasis';
import FinancialAccountsFilter from '../FinancialAccountsFilter';

/**
 * Balance sheet header - General panal.
 */
export default function BalanceSheetHeaderGeneralTab({}) {
  return (
    <div>
      <FinancialStatementDateRange />
      <SelectDisplayColumnsBy />
      <FinancialAccountsFilter
        initialSelectedItem={'all-accounts'}
      />
      <RadiosAccountingBasis key={'basis'} />
    </div>
  );
}
