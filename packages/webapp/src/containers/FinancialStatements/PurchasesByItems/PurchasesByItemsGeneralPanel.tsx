import React from 'react';
import intl from 'react-intl-universal';
import { filterItemsOptions } from '../constants';
import { FinancialStatementDateRange } from '../FinancialStatementDateRange';
import { FinancialStatementsFilter } from '../FinancialStatementsFilter';
import {
  PurchasesByItemsGeneralPanelProvider,
  usePurchaseByItemsGeneralPanelContext,
} from './PurchasesByItemsGeneralPanelProvider';
import { Row, Col, FItemsMultiSelect, FFormGroup } from '@/components';

/**
 *
 */
export function PurchasesByItemsGeneralPanel() {
  return (
    <PurchasesByItemsGeneralPanelProvider>
      <PurchasesByItemsGeneralPanelContent />
    </PurchasesByItemsGeneralPanelProvider>
  );
}

/**
 * Purchases by items - Drawer header - General panel.
 */
function PurchasesByItemsGeneralPanelContent() {
  const { items } = usePurchaseByItemsGeneralPanelContext();

  return (
    <div>
      <FinancialStatementDateRange />

      <Row>
        <Col xs={4}>
          <FinancialStatementsFilter
            items={filterItemsOptions}
            label={intl.get('items.label_filter_items')}
            initialSelectedItem={'with-transactions'}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={4}>
          <FFormGroup name={'itemsIds'} label={intl.get('Specific items')}>
            <FItemsMultiSelect name={'itemsIds'} items={items} />
          </FFormGroup>
        </Col>
      </Row>
    </div>
  );
}
