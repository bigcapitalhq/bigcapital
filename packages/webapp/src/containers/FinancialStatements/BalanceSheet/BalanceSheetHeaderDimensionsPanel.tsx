// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { FormGroup, Classes } from '@blueprintjs/core';
import { BranchMultiSelect, Row, Col } from '@/components';
import {
  BalanceSheetHeaderDimensionsProvider,
  useBalanceSheetHeaderDimensionsPanelContext,
} from './BalanceSheetHeaderDimensionsProvider';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';

/**
 * Balance sheet header dimension panel.
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
 * Balance sheet header dimension panel content.
 * @returns
 */
function BalanceSheetHeaderDimensionsPanelContent() {
  const { branches } = useBalanceSheetHeaderDimensionsPanelContext();
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
