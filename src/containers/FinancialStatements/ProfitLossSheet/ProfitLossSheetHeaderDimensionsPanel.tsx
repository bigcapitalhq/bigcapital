import React from 'react';
import intl from 'react-intl-universal';
import { FormGroup, Classes } from '@blueprintjs/core';
import { BranchMultiSelect, Row, Col } from 'components';
import {
  ProfitLossSheetHeaderDimensionsProvider,
  useProfitLossSheetPanelContext,
} from './ProfitLossSheetHeaderDimensionsProvider';

/**
 * profit loss Sheet Header dimensions panel.
 * @returns
 */
export default function ProfitLossSheetHeaderDimensionsPanel() {
  return (
    <ProfitLossSheetHeaderDimensionsProvider>
      <ProfitLossSheetHeaderDimensionsPanelContent />
    </ProfitLossSheetHeaderDimensionsProvider>
  );
}

/**
 * profit loss Sheet Header dimensions panel content.
 * @returns
 */
function ProfitLossSheetHeaderDimensionsPanelContent() {
  const { branches } = useProfitLossSheetPanelContext();

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
