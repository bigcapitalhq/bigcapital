import { Classes, FormGroup } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import {
  InventoryTurnoverByAmountDimensionsPanelProvider,
  useInventoryTurnoverByAmountDimensionsPanelContext,
} from './InventoryTurnoverByAmountHeaderDimensionsPanelProvider';
import {
  BranchMultiSelect,
  Col,
  Row,
  WarehouseMultiSelect,
} from '@/components';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';

/**
 * Inventory turnover by amount header dimensions panel.
 */
export function InventoryTurnoverByAmountHeaderDimensionsPanel() {
  return (
    <InventoryTurnoverByAmountDimensionsPanelProvider>
      <InventoryTurnoverByAmountHeaderDimensionsPanelContent />
    </InventoryTurnoverByAmountDimensionsPanelProvider>
  );
}

/**
 * Inventory turnover by amount header dimensions panel content.
 */
function InventoryTurnoverByAmountHeaderDimensionsPanelContent() {
  const { warehouses, branches } =
    useInventoryTurnoverByAmountDimensionsPanelContext();
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
