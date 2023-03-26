// @ts-nocheck
import React from 'react';

import { Row, Col } from '@/components';
import FinancialStatementDateRange from '../FinancialStatementDateRange';
import SelectDisplayColumnsBy from '../SelectDisplayColumnsBy';
import RadiosAccountingBasis from '../RadiosAccountingBasis';
import FinancialStatementsFilter from '../FinancialStatementsFilter';

/**
 * Profit/Loss sheet - Drawer header - General panel.
 */
export default function ProfitLossSheetHeaderGeneralPane({}) {
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
