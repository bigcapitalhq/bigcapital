import React from 'react';
import { FormGroup, Classes } from '@blueprintjs/core';
import { Field } from 'formik';
import {
  Row,
  Col,
  FormattedMessage as T,
  ItemsMultiSelect,
} from '../../../components';
import classNames from 'classnames';
import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import FinancialStatementsFilter from '../FinancialStatementsFilter';
import { filterItemsOptions } from '../common';

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
      <FinancialStatementsFilter
        items={filterItemsOptions}
        label={<T id={'items.label_filter_items'} />}
        initialSelectedItem={'all-items'}
      />

      <Row>
        <Col xs={4}>
          <Field name={'itemsIds'}>
            {({ form: { setFieldValue } }) => (
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
