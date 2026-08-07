import React from 'react';
import intl from 'react-intl-universal';
import { FinancialStatementDateRange } from '../FinancialStatementDateRange';
import {
  InventoryItemDetailsHeaderGeneralProvider,
  useInventoryItemDetailsHeaderGeneralContext,
} from './InventoryItemDetailsHeaderGeneralProvider';
import { FItemsMultiSelect, Row, Col, FFormGroup } from '@/components';

/**
 * Inventory item details header - General panel.
 */
export function InventoryItemDetailsHeaderGeneralPanel() {
  return (
    <InventoryItemDetailsHeaderGeneralProvider>
      <InventoryItemDetailsHeaderGeneralPanelContent />
    </InventoryItemDetailsHeaderGeneralProvider>
  );
}

/**
 * Inventory item details header - General panel - Content.
 */
function InventoryItemDetailsHeaderGeneralPanelContent() {
  const { items } = useInventoryItemDetailsHeaderGeneralContext();

  return (
    <div>
      <FinancialStatementDateRange />

      <Row>
        <Col xs={4}>
          <FFormGroup label={intl.get('Specific items')} name={'itemsIds'}>
            <FItemsMultiSelect name={'itemsIds'} items={items} />
          </FFormGroup>
        </Col>
      </Row>
    </div>
  );
}
