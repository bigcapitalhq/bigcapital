import React from 'react';
import intl from 'react-intl-universal';
import { FormGroup, Classes } from '@blueprintjs/core';
import { BranchMultiSelect, Row, Col } from 'components';
import {
  JournalSheetHeaderDimensionsProvider,
  useJournalSheetHeaderDimensionsPanelContext,
} from './JournalSheetHeaderDimensionsProvider';

/**
 * Journal sheet header dismension panel.
 * @returns
 */
export default function JournalSheetHeaderDimensions() {
  return (
    <JournalSheetHeaderDimensionsProvider>
      <JournalSheetHeaderDimensionsContent />
    </JournalSheetHeaderDimensionsProvider>
  );
}

/**
 * Journal sheet header dismension panel content.
 * @returns
 */
function JournalSheetHeaderDimensionsContent() {
  const { branches } = useJournalSheetHeaderDimensionsPanelContext();

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
