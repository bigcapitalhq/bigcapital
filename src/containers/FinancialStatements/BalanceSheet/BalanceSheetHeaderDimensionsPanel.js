import React from 'react';
import { FormGroup, Classes } from '@blueprintjs/core';
import { BranchMultiSelect, FieldHint, Row, Col } from 'components';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import { useBranches } from 'hooks/query';

/**
 * Balance sheet header dismension panel.
 * @returns
 */
function BalanceSheetHeaderDimensionsPanel() {
  // Fetches the branches list.
  const { isLoading: isBranchesLoading, data: branches } = useBranches();

  return (
    <Row>
      <Col xs={4}>
        <FormGroup
          label={'Branches'}
          labelInfo={<FieldHint />}
          className={Classes.FILL}
        >
          <BranchMultiSelect
            name={'branchesIds'}
            branches={branches}
            popoverProps={{ minimal: true }}
          />
        </FormGroup>
      </Col>
    </Row>
  );
}

export default BalanceSheetHeaderDimensionsPanel;
