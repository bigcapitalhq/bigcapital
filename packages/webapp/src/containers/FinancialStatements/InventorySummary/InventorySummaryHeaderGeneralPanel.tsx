import React from 'react';
import intl from 'react-intl-universal';
import { filterItemsOptions } from '../constants';
import { FinancialStatementDateRange } from '../FinancialStatementDateRange';
import { FinancialStatementsFilter } from '../FinancialStatementsFilter';
import {
  InventorySummaryGeneralPanelProvider,
  useInventorySummaryGeneralPanelContext,
} from './InventorySummaryHeaderGeneralPanelProvider';
import { Row, Col, FItemsMultiSelect, FFormGroup } from '@/components';

/**
 * Inventory summary - Drawer header - General panel.
 */
export function InventorySummaryHeaderGeneralPanel() {
  return (
    <InventorySummaryGeneralPanelProvider>
      <InventorySummaryHeaderGeneralPanelContent />
    </InventorySummaryGeneralPanelProvider>
  );
}

/**
 * Inventory summary - Drawer header - General panel - Content.
 */
function InventorySummaryHeaderGeneralPanelContent() {
  const { items } = useInventorySummaryGeneralPanelContext();

  return (
    <div>
      <FinancialStatementDateRange />

      <Row>
        <Col xs={4}>
          <FinancialStatementsFilter
            items={filterItemsOptions.filter(
              (option) => option.key !== 'with-only-active',
            )}
            label={intl.get('items.label_filter_items')}
            initialSelectedItem={'with-transactions'}
          />
        </Col>
      </Row>

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
