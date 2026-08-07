import React from 'react';
import intl from 'react-intl-universal';
import { filterItemsOptions } from '../constants';
import { FinancialStatementDateRange } from '../FinancialStatementDateRange';
import { FinancialStatementsFilter } from '../FinancialStatementsFilter';
import {
  SalesByItemGeneralPanelProvider,
  useSalesByItemsGeneralPanelContext,
} from './SalesByItemsHeaderGeneralPanelProvider';
import { Row, Col, FItemsMultiSelect, FFormGroup } from '@/components';

/**
 * Sales by items - Drawer header - General panel.
 */
export function SalesByItemsHeaderGeneralPanel() {
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
