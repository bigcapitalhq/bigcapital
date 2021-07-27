import React from 'react';
import classNames from 'classnames';
import { Field } from 'formik';
import { Classes, FormGroup } from '@blueprintjs/core';
import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import { Row, Col } from 'components';
import { ContactsMultiSelect, FormattedMessage as T } from 'components';
import { useCustomersTransactionsContext } from './CustomersTransactionsProvider';

/**
 * Customers transactions header - General panel.
 */
export default function CustomersTransactionsHeaderGeneralPanel() {
  const { customers } = useCustomersTransactionsContext();

  return (
    <div>
      <FinancialStatementDateRange />

      <Row>
        <Col xs={5}>
          <Field name={'customersIds'}>
            {({
              form: { setFieldValue },
              field: { value },
            }) => (
              <FormGroup
                label={<T id={'specific_customers'} />}
                className={classNames('form-group--select-list', Classes.FILL)}
              >
                <ContactsMultiSelect
                  onContactSelect={(contactsIds) => {
                    setFieldValue('customersIds', contactsIds);
                  }}
                  contacts={customers}
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
