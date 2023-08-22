// @ts-nocheck
import React from 'react';
import {
  Row,
  Col,
  ItemsMultiSelect,
  FormattedMessage as T,
  FFormGroup,
} from '@/components';
import FinancialStatementDateRange from '../FinancialStatementDateRange';
import FinancialStatementsFilter from '../FinancialStatementsFilter';
import { filterItemsOptions } from '../constants';
import {
  SalesByItemGeneralPanelProvider,
  useSalesByItemsGeneralPanelContext,
} from './SalesByItemsHeaderGeneralPanelProvider';

/**
 * Sales by items - Drawer header - General panel.
 */
export default function SalesByItemsHeaderGeneralPanel() {
  return (
    <SalesByItemGeneralPanelProvider>
      <SalesByItemsHeaderGeneralPanelContent />
    </SalesByItemGeneralPanelProvider>
  );
}

/**
 * Sales by items - Drawer header - General panel - Content.
 */
function SalesByItemsHeaderGeneralPanelContent() {
  const { items } = useSalesByItemsGeneralPanelContext();

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
          <FFormGroup label={<T id={'Specific items'} />} name={'itemsIds'}>
            <ItemsMultiSelect name={'itemsIds'} items={items} />
          </FFormGroup>
        </Col>
      </Row>
    </div>
  );
}
