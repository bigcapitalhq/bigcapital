import React from 'react';
import intl from 'react-intl-universal';
import { FormGroup, Classes } from '@blueprintjs/core';
import { BranchMultiSelect, Row, Col } from 'components';
import {
  ARAgingSummaryHeaderDimensionsProvider,
  useARAgingSummaryHeaderDimensonsContext,
} from './ARAgingSummaryHeaderDimensionsProvider';

/**
 * ARAging summary header dimensions.
 * @returns
 */
export default function ARAgingSummaryHeaderDimensions() {
  return (
    <ARAgingSummaryHeaderDimensionsProvider>
      <ARAgingSummaryHeaderDimensionsContent />
    </ARAgingSummaryHeaderDimensionsProvider>
  );
}

/**
 * ARAging summary header dimensions content.
 * @returns
 */
function ARAgingSummaryHeaderDimensionsContent() {
  const { branches } = useARAgingSummaryHeaderDimensonsContext();

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
