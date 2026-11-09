import { FormGroup, Classes } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import {
  ProfitLossSheetHeaderDimensionsProvider,
  useProfitLossSheetPanelContext,
} from './ProfitLossSheetHeaderDimensionsProvider';
import { BranchMultiSelect, Row, Col } from '@/components';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';

/**
 * profit loss Sheet Header dimensions panel.
 * @returns {JSX.Element}
 */
export function ProfitLossSheetHeaderDimensionsPanel() {
  return (
    <ProfitLossSheetHeaderDimensionsProvider>
      <ProfitLossSheetHeaderDimensionsPanelContent />
    </ProfitLossSheetHeaderDimensionsProvider>
  );
}

/**
 * Profit/Loss Sheet Header dimensions panel content.
 * @returns {JSX.Element}
 */
function ProfitLossSheetHeaderDimensionsPanelContent() {
  const { branches } = useProfitLossSheetPanelContext();
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
