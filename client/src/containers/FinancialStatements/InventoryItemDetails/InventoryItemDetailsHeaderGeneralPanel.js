import React from 'react';
import classNames from 'classnames';
import { FormGroup, Classes } from '@blueprintjs/core';
import { Field } from 'formik';
import { Row, Col, FormattedMessage as T } from 'components';
import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import { useInventoryItemDetailsContext } from './InventoryItemDetailsProvider';
import { InventoryItemDetailsHeaderGeneralProvider } from './InventoryItemDetailsHeaderGeneralProvider';

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
  const { items } = useInventoryItemDetailsContext();

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
              ></FormGroup>
            )}
          </Field>
        </Col>
      </Row>
    </div>
  );
}
