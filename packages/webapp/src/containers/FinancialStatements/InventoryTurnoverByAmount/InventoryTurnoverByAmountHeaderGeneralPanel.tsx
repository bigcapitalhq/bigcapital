import React from 'react';
import intl from 'react-intl-universal';
import { FinancialStatementDateRange } from '../FinancialStatementDateRange';
import {
  InventoryTurnoverByAmountGeneralPanelProvider,
  useInventoryTurnoverByAmountGeneralPanelContext,
} from './InventoryTurnoverByAmountHeaderGeneralPanelProvider';
import { Col, FFormGroup, FItemsMultiSelect, Row } from '@/components';

/**
 * Inventory turnover by amount header general panel.
 */
export function InventoryTurnoverByAmountHeaderGeneralPanel() {
  return (
    <InventoryTurnoverByAmountGeneralPanelProvider>
      <InventoryTurnoverByAmountHeaderGeneralPanelContent />
    </InventoryTurnoverByAmountGeneralPanelProvider>
  );
}

/**
 * Inventory turnover by amount header general panel content.
 */
function InventoryTurnoverByAmountHeaderGeneralPanelContent() {
  const { items } = useInventoryTurnoverByAmountGeneralPanelContext();

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
