import { FormGroup, Classes } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import {
  InventorySummaryHeaderDimensionsProvider,
  useInventorySummaryHeaderDimensionsPanelContext,
} from './InventorySummaryHeaderDimensionsPanelProvider';
import {
  BranchMultiSelect,
  WarehouseMultiSelect,
  Row,
  Col,
} from '@/components';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';

/**
 * Inventory summary header dimensions panel.
 * @returns {JSX.Element}
 */
export function InventorySummaryHeaderDimensionsPanel() {
  return (
    <InventorySummaryHeaderDimensionsProvider>
      <InventorySummaryHeaderDimensionsPanelContent />
    </InventorySummaryHeaderDimensionsProvider>
  );
}

/**
 * Inventory summary header dimensions panel content.
 * @returns {JSX.Element}
 */
function InventorySummaryHeaderDimensionsPanelContent() {
  const { warehouses, branches } =
    useInventorySummaryHeaderDimensionsPanelContext();

  // Detarmines the given feature whether is enabled.
  const { featureCan } = useFeatureCan();

  const isBranchesFeatureCan = featureCan(Features.Branches);
  const isWarehousesFeatureCan = featureCan(Features.Warehouses);

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
        {isWarehousesFeatureCan && (
          <FormGroup
            label={intl.get('warehouses_multi_select.label')}
            className={Classes.FILL}
          >
            <WarehouseMultiSelect
              name={'warehousesIds'}
              warehouses={warehouses}
            />
          </FormGroup>
        )}
      </Col>
    </Row>
  );
}
