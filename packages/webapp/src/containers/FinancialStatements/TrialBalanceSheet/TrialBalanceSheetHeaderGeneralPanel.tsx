// @ts-nocheck
import React from 'react';

import { Row, Col } from '@/components';
import FinancialStatementDateRange from '../FinancialStatementDateRange';
import RadiosAccountingBasis from '../RadiosAccountingBasis';
import FinancialStatementsFilter from '../FinancialStatementsFilter';

/**
 * Trial balance sheet - Drawer header - General panel.
 */
export default function TrialBalanceSheetHeaderGeneralPanel({}) {
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
