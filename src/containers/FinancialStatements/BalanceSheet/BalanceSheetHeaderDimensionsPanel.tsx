import React from 'react';
import intl from 'react-intl-universal';
import { FormGroup, Classes } from '@blueprintjs/core';
import { BranchMultiSelect, Row, Col } from '@/components';
import {
  BalanceSheetHeaderDimensionsProvider,
  useBalanceSheetHeaderDimensionsPanelContext,
} from './BalanceSheetHeaderDimensionsProvider';

/**
 * Balance sheet header dismension panel.
 * @returns
 */
export default function BalanceSheetHeaderDimensionsPanel() {
  return (
    <BalanceSheetHeaderDimensionsProvider>
      <BalanceSheetHeaderDimensionsPanelContent />
    </BalanceSheetHeaderDimensionsProvider>
  );
}

/**
 * Balance sheet header dismension panel content.
 * @returns
 */
function BalanceSheetHeaderDimensionsPanelContent() {
  const { branches } = useBalanceSheetHeaderDimensionsPanelContext();
  
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
