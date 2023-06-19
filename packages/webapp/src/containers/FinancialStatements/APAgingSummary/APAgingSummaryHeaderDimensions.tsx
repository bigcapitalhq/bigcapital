// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { FormGroup, Classes } from '@blueprintjs/core';
import { BranchMultiSelect, Row, Col } from '@/components';
import {
  APAgingSummaryHeaderDimensionsProvider,
  useAPAgingSummaryHeaderDimensonsContext,
} from './APAgingSummaryHeaderDimensionsProvider';
import { useFeatureCan } from '@/hooks/state';
import { Features } from '@/constants';

/**
 * APAging summary header dimensions.
 * @returns
 */
export default function APAgingSummaryHeaderDimensions() {
  return (
    <APAgingSummaryHeaderDimensionsProvider>
      <APAgingSummaryHeaderDimensionsContent />
    </APAgingSummaryHeaderDimensionsProvider>
  );
}

/**
 * APAging summary header dimensions content.
 * @returns
 */
function APAgingSummaryHeaderDimensionsContent() {
  const { branches } = useAPAgingSummaryHeaderDimensonsContext();

  // Determines the feature whether is enabled.
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
