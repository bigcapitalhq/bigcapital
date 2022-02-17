import React from 'react';
import intl from 'react-intl-universal';
import { FormGroup, Classes } from '@blueprintjs/core';
import { WarehouseMultiSelect, Row, Col } from 'components';
import {
  InventoryItemDetailsHeaderDimensionsProvider,
  useInventoryItemDetailsHeaderDimensionsPanelContext,
} from './InventoryItemDetailsHeaderDimensionsPanelProvider';

/**
 * Inventory Item deatil header dismension panel.
 * @returns
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
 * @returns
 */
function InventoryItemDetailsHeaderDimensionsPanelContent() {
  const { warehouses } = useInventoryItemDetailsHeaderDimensionsPanelContext();

  return (
    <Row>
      <Col xs={4}>
        <FormGroup
          label={intl.get('warehouses_multi_select.label')}
          className={Classes.FILL}
        >
          <WarehouseMultiSelect
            name={'warehousesIds'}
            warehouses={warehouses}
          />
        </FormGroup>
      </Col>
    </Row>
  );
}
