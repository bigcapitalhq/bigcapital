import { FormGroup, Classes } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import {
  GeneralLedgerHeaderDimensionsPanelProvider,
  useGeneralLedgerHeaderDimensionsContext,
} from './GeneralLedgerHeaderDimensionsPanelProvider';
import { BranchMultiSelect, Row, Col } from '@/components';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';

/**
 * Gereral ledger sheet header dismension panel.
 * @returns
 */
export function GeneralLedgerHeaderDimensionsPanel() {
  return (
    <GeneralLedgerHeaderDimensionsPanelProvider>
      <GeneralLedgerHeaderDimensionsPanelContent />
    </GeneralLedgerHeaderDimensionsPanelProvider>
  );
}

/**
 * Gereral ledger sheet header dismension panel content.
 * @returns
 */
function GeneralLedgerHeaderDimensionsPanelContent() {
  const { branches } = useGeneralLedgerHeaderDimensionsContext();

  // Detarmines the feature whether is enabled.
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
