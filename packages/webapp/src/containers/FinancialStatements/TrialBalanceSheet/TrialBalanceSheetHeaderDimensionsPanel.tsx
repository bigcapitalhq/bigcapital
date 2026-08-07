import { FormGroup, Classes } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import {
  TrialBLHeaderDimensionsPanelProvider,
  useTrialBalanceSheetPanelContext,
} from './TrialBalanceSheetHeaderDimensionsPanelProvider';
import { BranchMultiSelect, Row, Col } from '@/components';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';

/**
 * Trial balance sheet header dimension panel.
 * @returns {JSX.Element}
 */
export function TrialBalanceSheetHeaderDimensionsPanel() {
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
