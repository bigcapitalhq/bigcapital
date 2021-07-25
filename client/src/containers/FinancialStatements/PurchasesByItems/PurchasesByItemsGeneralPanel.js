import React from 'react';
import { FormGroup, Classes } from '@blueprintjs/core';
import { Field } from 'formik';
import { Row, Col, FormattedMessage as T } from 'components';
import classNames from 'classnames';
import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';

import { ItemsMultiSelect } from 'components';
import { usePurchaseByItemsContext } from './PurchasesByItemsProvider';

/**
 * Purchases by items - Drawer header - General panel.
 */
export default function PurchasesByItemsGeneralPanel() {
  const { items } = usePurchaseByItemsContext();

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
                  selectedItems={value}
                  onItemSelect={(itemsIds) => {
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
