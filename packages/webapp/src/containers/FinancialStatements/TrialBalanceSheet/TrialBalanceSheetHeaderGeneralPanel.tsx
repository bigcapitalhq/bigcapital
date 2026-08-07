import React from 'react';
import { FinancialStatementDateRange } from '../FinancialStatementDateRange';
import { FinancialStatementsFilter } from '../FinancialStatementsFilter';
import { RadiosAccountingBasis } from '../RadiosAccountingBasis';
import { Row, Col } from '@/components';

/**
 * Trial balance sheet - Drawer header - General panel.
 */
export function TrialBalanceSheetHeaderGeneralPanel() {
  return (
    <div>
      <FinancialStatementDateRange />

      <Row>
        <Col xs={4}>
          <FinancialStatementsFilter
            initialSelectedItem={'with-transactions'}
          />
        </Col>
      </Row>
      <RadiosAccountingBasis />
    </div>
  );
}
