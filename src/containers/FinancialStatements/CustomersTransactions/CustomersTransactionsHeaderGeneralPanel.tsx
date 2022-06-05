import React from 'react';
import classNames from 'classnames';
import { Field } from 'formik';
import { Classes, FormGroup } from '@blueprintjs/core';
import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import FinancialStatementsFilter from '../FinancialStatementsFilter';
import {
  Row,
  Col,
  ContactsMultiSelect,
  FormattedMessage as T,
} from '../../../components';
import { filterCustomersOptions } from '../constants';

import {
  CustomersTransactionsGeneralPanelProvider,
  useCustomersTransactionsGeneralPanelContext,
} from './CustomersTransactionsHeaderGeneralPanelProvider';

/**
 * Customers transactions header - General panel.
 */
export default function CustomersTransactionsHeaderGeneralPanel() {
  return (
    <CustomersTransactionsGeneralPanelProvider>
      <CustomersTransactionsHeaderGeneralPanelContent />
    </CustomersTransactionsGeneralPanelProvider>
  );
}

/**
 * Customers transactions header - General panel - Content.
 */
function CustomersTransactionsHeaderGeneralPanelContent() {
  const { customers } = useCustomersTransactionsGeneralPanelContext();

  return (
    <div>
      <FinancialStatementDateRange />

      <Row>
        <Col xs={4}>
          <FinancialStatementsFilter
            items={filterCustomersOptions}
            label={<T id={'customers.label_filter_customers'} />}
            initialSelectedItem={'with-transactions'}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={4}>
          <Field name={'customersIds'}>
            {({ form: { setFieldValue }, field: { value } }) => (
              <FormGroup
                label={<T id={'specific_customers'} />}
                className={classNames('form-group--select-list', Classes.FILL)}
              >
                <ContactsMultiSelect
                  items={customers}
                  onItemSelect={(customers) => {
                    const customersIds = customers.map(
                      (customer) => customer.id,
                    );
                    setFieldValue('customersIds', customersIds);
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
