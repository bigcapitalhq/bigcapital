import React from 'react';
import intl from 'react-intl-universal';
import { FormGroup, Classes } from '@blueprintjs/core';
import { WarehouseMultiSelect, Row, Col } from 'components';
import {
  InventoryValuationHeaderDimensionsProvider,
  useInventoryValuationHeaderDimensionsPanelContext,
} from './InventoryValuationHeaderDimensionsPanelProvider';

/**
 * Inventory Valuation header dismension panel.
 * @returns
 */
export default function InventoryValuationHeaderDimensionsPanel() {
  return (
    <InventoryValuationHeaderDimensionsProvider>
      <InventoryValuationHeaderDimensionsPanelContent />
    </InventoryValuationHeaderDimensionsProvider>
  );
}

/**
 * Inventory Valuation header dismension panel content.
 * @returns
 */
function InventoryValuationHeaderDimensionsPanelContent() {
  const { warehouses } = useInventoryValuationHeaderDimensionsPanelContext();

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
