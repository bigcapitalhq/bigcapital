import React from 'react';

import { Row, Col } from '../../../components';

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

      <Row>
        <Col xs={4}>
          <FinancialStatementsFilter initialSelectedItem={'all-accounts'} />
        </Col>
      </Row>
      <RadiosAccountingBasis key={'basis'} />
    </div>
  );
}
