import React from 'react';
import intl from 'react-intl-universal';
import { FormGroup, Classes } from '@blueprintjs/core';
import { BranchMultiSelect, Row, Col } from '@/components';
import {
  CashFlowStatementDimensionsPanelProvider,
  useCashFlowStatementDimensionsPanelContext,
} from './CashFlowStatementDimensionsPanelProvider';

/**
 * Cash flow statement dismension panel.
 * @returns
 */
export default function CashFlowStatementDimensionsPanel() {
  return (
    <CashFlowStatementDimensionsPanelProvider>
      <CashFlowStatementDimensionsPanelContent />
    </CashFlowStatementDimensionsPanelProvider>
  );
}

/**
 * Cash flow statement dismension panel content.
 * @returns
 */
function CashFlowStatementDimensionsPanelContent() {
  // Fetches the branches list.
  const { branches } = useCashFlowStatementDimensionsPanelContext();

  return (
    <Row>
      <Col xs={4}>
        <FormGroup
          label={intl.get('branches_multi_select.label')}
          className={Classes.FILL}
        >
          <BranchMultiSelect name={'branchesIds'} branches={branches} />
        </FormGroup>
      </Col>
    </Row>
  );
}
