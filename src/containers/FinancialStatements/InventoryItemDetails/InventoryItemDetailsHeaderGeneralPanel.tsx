import React from 'react';
import { FormGroup, Classes } from '@blueprintjs/core';
import { Field } from 'formik';
import {
  ItemsMultiSelect,
  Row,
  Col,
  FormattedMessage as T,
} from '@/components';
import classNames from 'classnames';
import FinancialStatementDateRange from '../FinancialStatementDateRange';

import {
  InventoryItemDetailsHeaderGeneralProvider,
  useInventoryItemDetailsHeaderGeneralContext,
} from './InventoryItemDetailsHeaderGeneralProvider';

/**
 * Inventory item details header - General panel.
 */
export default function InventoryItemDetailsHeaderGeneralPanel() {
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
          <Field name={'itemsIds'}>
            {({
              form: { setFieldValue },
              field: { value },
              meta: { error, touched },
            }) => (
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
