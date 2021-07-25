import React from 'react';
import { Field } from 'formik';
import classNames from 'classnames';
import { Classes, FormGroup } from '@blueprintjs/core';
import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import { Row, Col } from 'components';
import { ContactsMultiSelect, FormattedMessage as T } from 'components';
import { useVendorsTransactionsContext } from './VendorsTransactionsProvider';

/**
 * Vendors transactions header - General panel.
 */
export default function VendorsTransactionsHeaderGeneralPanel() {
  const { vendors } = useVendorsTransactionsContext();

  return (
    <div>
      <FinancialStatementDateRange />

      <Row>
        <Col xs={5}>
          <Field name={'vendorsIds'}>
            {({ form: { setFieldValue }, field: { value } }) => (
              <FormGroup
                label={<T id={'specific_vendors'} />}
                className={classNames('form-group--select-list', Classes.FILL)}
              >
                <ContactsMultiSelect
                  onContactSelect={(contactsIds) => {
                    setFieldValue('vendorsIds', contactsIds);
                  }}
                  contacts={vendors}
                  contactsSelected={value}
                />
              </FormGroup>
            )}
          </Field>
        </Col>
      </Row>
    </div>
  );
}
