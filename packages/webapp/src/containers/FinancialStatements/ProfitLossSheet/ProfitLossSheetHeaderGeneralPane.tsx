import React from 'react';
import { FinancialStatementDateRange } from '../FinancialStatementDateRange';
import { FinancialStatementsFilter } from '../FinancialStatementsFilter';
import { RadiosAccountingBasis } from '../RadiosAccountingBasis';
import { SelectDisplayColumnsBy } from '../SelectDisplayColumnsBy';
import { Row, Col } from '@/components';

export function ProfitLossSheetHeaderGeneralPane() {
  return (
    <div>
      <FinancialStatementDateRange />
      <SelectDisplayColumnsBy />

      <Row>
        <Col xs={4}>
          <FinancialStatementsFilter
            initialSelectedItem={'with-transactions'}
          />
        </Col>
      </Row>
      <RadiosAccountingBasis key={'basis'} />
    </div>
  );
}
