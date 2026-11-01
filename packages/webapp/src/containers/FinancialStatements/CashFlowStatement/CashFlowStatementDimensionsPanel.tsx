import { FormGroup, Classes } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import {
  CashFlowStatementDimensionsPanelProvider,
  useCashFlowStatementDimensionsPanelContext,
} from './CashFlowStatementDimensionsPanelProvider';
import { BranchMultiSelect, Row, Col } from '@/components';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';

/**
 * Cash flow statement dismension panel.
 * @returns
 */
export function CashFlowStatementDimensionsPanel() {
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

  const { featureCan } = useFeatureCan();

  const isBranchesFeatureCan = featureCan(Features.Branches);

  return (
    <Row>
      <Col xs={4}>
        {isBranchesFeatureCan && (
          <FormGroup
            label={intl.get('branches_multi_select.label')}
            className={Classes.FILL}
          >
            <BranchMultiSelect name={'branchesIds'} branches={branches} />
          </FormGroup>
        )}
      </Col>
    </Row>
  );
}
