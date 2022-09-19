// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { FormGroup, Classes } from '@blueprintjs/core';
import { BranchMultiSelect, WarehouseMultiSelect, Row, Col } from '@/components';
import {
  InventoryValuationHeaderDimensionsProvider,
  useInventoryValuationHeaderDimensionsPanelContext,
} from './InventoryValuationHeaderDimensionsPanelProvider';

/**
 * Inventory Valuation header dismension panel.
 * @returns {JSX.Element}
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
 * @returns {JSX.Element}
 */
function InventoryValuationHeaderDimensionsPanelContent() {
  const { warehouses, branches } =
    useInventoryValuationHeaderDimensionsPanelContext();

  return (
    <Row>
      <Col xs={4}>
        <FormGroup
          label={intl.get('branches_multi_select.label')}
          className={Classes.FILL}
        >
          <BranchMultiSelect name={'branchesIds'} branches={branches} />
        </FormGroup>

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
