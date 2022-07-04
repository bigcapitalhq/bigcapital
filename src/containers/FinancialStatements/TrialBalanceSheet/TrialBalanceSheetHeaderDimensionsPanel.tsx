import React from 'react';
import intl from 'react-intl-universal';
import { FormGroup, Classes } from '@blueprintjs/core';
import { BranchMultiSelect, Row, Col } from '@/components';
import {
  TrialBLHeaderDimensionsPanelProvider,
  useTrialBalanceSheetPanelContext,
} from './TrialBalanceSheetHeaderDimensionsPanelProvider';

/**
 * Trial balance sheet header dismension panel.
 * @returns
 */
export default function TrialBalanceSheetHeaderDimensionsPanel() {
  return (
    <TrialBLHeaderDimensionsPanelProvider>
      <TrialBLSheetHeaderDimensionsPanelContent />
    </TrialBLHeaderDimensionsPanelProvider>
  );
}

/**
 * trial balance sheet header dismension panel content.
 * @returns
 */
function TrialBLSheetHeaderDimensionsPanelContent() {
  const { branches } = useTrialBalanceSheetPanelContext();

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
