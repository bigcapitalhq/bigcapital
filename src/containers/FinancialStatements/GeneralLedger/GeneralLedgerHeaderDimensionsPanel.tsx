import React from 'react';
import intl from 'react-intl-universal';
import { FormGroup, Classes } from '@blueprintjs/core';
import { BranchMultiSelect, Row, Col } from '@/components';
import {
  GeneralLedgerHeaderDimensionsPanelProvider,
  useGeneralLedgerHeaderDimensionsContext,
} from './GeneralLedgerHeaderDimensionsPanelProvider';

/**
 * Gereral ledger sheet header dismension panel.
 * @returns
 */
export default function GeneralLedgerHeaderDimensionsPanel() {
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
