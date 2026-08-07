import { FormGroup, Classes } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import {
  APAgingSummaryHeaderDimensionsProvider,
  useAPAgingSummaryHeaderDimensonsContext,
} from './APAgingSummaryHeaderDimensionsProvider';
import { BranchMultiSelect, Row, Col } from '@/components';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';

export function APAgingSummaryHeaderDimensions() {
  return (
    <APAgingSummaryHeaderDimensionsProvider>
      <APAgingSummaryHeaderDimensionsContent />
    </APAgingSummaryHeaderDimensionsProvider>
  );
}

function APAgingSummaryHeaderDimensionsContent() {
  const { branches } = useAPAgingSummaryHeaderDimensonsContext();

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
