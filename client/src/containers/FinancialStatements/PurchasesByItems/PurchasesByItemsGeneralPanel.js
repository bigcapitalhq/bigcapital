import React from 'react';
import { FormGroup, Classes } from '@blueprintjs/core';
import { Field } from 'formik';
import { Row, Col, FormattedMessage as T } from 'components';
import classNames from 'classnames';
import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';

import { ItemsMultiSelect } from 'components';
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

              </FormGroup>
            )}
          </Field>
        </Col>
      </Row>
    </div>
  );
}
