import React from 'react';
import { FormGroup, Classes } from '@blueprintjs/core';
import { Field } from 'formik';
import classNames from 'classnames';
import { Row, Col, ItemsMultiSelect, FormattedMessage as T } from 'components';
import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import { useSalesByItemsContext } from './SalesByItemProvider';

/**
 * sells by items - Drawer header - General panel.
 */
export default function SalesByItemsHeaderGeneralPanel() {
  const { items } = useSalesByItemsContext();

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
                  onTagRenderer={(value) => value}
                />
              </FormGroup>
            )}
          </Field>
        </Col>
      </Row>
    </div>
  );
}
