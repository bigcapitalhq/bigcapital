import React from 'react';
import intl from 'react-intl-universal';
import { FormGroup, Classes } from '@blueprintjs/core';
import { BranchMultiSelect, Row, Col } from 'components';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import { useBranches } from 'hooks/query';

/**
 * Cash flow statement dismension panel.
 * @returns
 */
export default function CashFlowStatementDimensionsPanel() {
  // Fetches the branches list.
  const { isLoading: isBranchesLoading, data: branches } = useBranches();

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
