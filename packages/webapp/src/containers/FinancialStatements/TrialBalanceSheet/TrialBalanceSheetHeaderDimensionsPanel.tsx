// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { FormGroup, Classes } from '@blueprintjs/core';
import { BranchMultiSelect, Row, Col } from '@/components';
import {
  TrialBLHeaderDimensionsPanelProvider,
  useTrialBalanceSheetPanelContext,
} from './TrialBalanceSheetHeaderDimensionsPanelProvider';
import { useFeatureCan } from '@/hooks/state';
import { Features } from '@/constants';

/**
 * Trial balance sheet header dimension panel.
 * @returns {JSX.Element}
 */
export default function TrialBalanceSheetHeaderDimensionsPanel() {
  return (
    <TrialBLHeaderDimensionsPanelProvider>
      <TrialBLSheetHeaderDimensionsPanelContent />
    </TrialBLHeaderDimensionsPanelProvider>
  );
}

/**
 * Trial balance sheet header dimension panel content.
 * @returns {JSX.Element}
 */
function TrialBLSheetHeaderDimensionsPanelContent() {
  const { branches } = useTrialBalanceSheetPanelContext();
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
