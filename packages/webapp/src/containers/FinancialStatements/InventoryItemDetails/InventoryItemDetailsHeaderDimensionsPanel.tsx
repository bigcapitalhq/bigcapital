// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { FormGroup, Classes } from '@blueprintjs/core';
import {
  BranchMultiSelect,
  WarehouseMultiSelect,
  Row,
  Col,
} from '@/components';
import {
  InventoryItemDetailsHeaderDimensionsProvider,
  useInventoryItemDetailsHeaderDimensionsPanelContext,
} from './InventoryItemDetailsHeaderDimensionsPanelProvider';

/**
 * Inventory Item detail header dismension panel.
 * @returns {JSX.Element}
 */
export default function InventoryItemDetailsHeaderDimensionsPanel() {
  return (
    <InventoryItemDetailsHeaderDimensionsProvider>
      <InventoryItemDetailsHeaderDimensionsPanelContent />
    </InventoryItemDetailsHeaderDimensionsProvider>
  );
}

/**
 * Inventory Valuation header dismension panel content.
 * @returns {JSX.Element}
 */
function InventoryItemDetailsHeaderDimensionsPanelContent() {
  const { warehouses, branches } =
    useInventoryItemDetailsHeaderDimensionsPanelContext();

  // Determines the given feature whether is enabled.
  const { featureCan } = useFeatureCan();

  const isBranchesFeatureCan = featureCan(Features.Branches);
  const isWarehousesFeatureCan = featureCan(Features.warehouses);

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
