// @ts-nocheck
import { Row, Col } from '@/components';
import FinancialStatementDateRange from '../FinancialStatementDateRange';
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
