// @ts-nocheck
import React from 'react';
import {
  Row,
  Col,
  FormattedMessage as T,
  ItemsMultiSelect,
  FFormGroup,
} from '@/components';
import FinancialStatementDateRange from '../FinancialStatementDateRange';
import FinancialStatementsFilter from '../FinancialStatementsFilter';
import { filterItemsOptions } from '../constants';

import {
  PurchasesByItemsGeneralPanelProvider,
  usePurchaseByItemsGeneralPanelContext,
} from './PurchasesByItemsGeneralPanelProvider';

/**
 *
 */
export default function PurchasesByItemsGeneralPanel() {
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
            label={<T id={'items.label_filter_items'} />}
            initialSelectedItem={'with-transactions'}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={4}>
          <FFormGroup name={'itemsIds'} label={<T id={'Specific items'} />}>
            <ItemsMultiSelect name={'itemsIds'} items={items} />
          </FFormGroup>
        </Col>
      </Row>
    </div>
  );
}
