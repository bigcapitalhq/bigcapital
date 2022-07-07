import React from 'react';
import { FormGroup, Classes } from '@blueprintjs/core';
import { Field } from 'formik';
import classNames from 'classnames';

import { filterItemsOptions } from '../constants';
import { Row, Col, ItemsMultiSelect, FormattedMessage as T } from '@/components';
import FinancialStatementDateRange from '../FinancialStatementDateRange';
import FinancialStatementsFilter from '../FinancialStatementsFilter';
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
          <Field name={'itemsIds'}>
            {({ form: { setFieldValue }, field: { value } }) => (
              <FormGroup
                label={<T id={'Specific items'} />}
                className={classNames('form-group--select-list', Classes.FILL)}
              >
                <ItemsMultiSelect
                  items={items}
                  onItemSelect={(items) => {
                    const itemsIds = items.map((item) => item.id);
                    setFieldValue('itemsIds', itemsIds);
                  }}
                />
              </FormGroup>
            )}
          </Field>
        </Col>
      </Row>
    </div>
  );
}
