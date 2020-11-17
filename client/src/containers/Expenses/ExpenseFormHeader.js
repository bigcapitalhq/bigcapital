import React, { useMemo, useCallback, useState } from 'react';
import {
  InputGroup,
  FormGroup,
  Intent,
  Position,
  MenuItem,
  Classes,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FormattedMessage as T } from 'react-intl';
import { Row, Col } from 'react-grid-system';
import moment from 'moment';
import { momentFormatter, compose, tansformDateValue } from 'utils';
import classNames from 'classnames';
import {
  CurrencySelectList,
  ContactSelecetList,
  ErrorMessage,
  AccountsSelectList,
  FieldRequiredHint,
  Hint,
} from 'components';
import withCurrencies from 'containers/Currencies/withCurrencies';
import withAccounts from 'containers/Accounts/withAccounts';
import withCustomers from 'containers/Customers/withCustomers';

function ExpenseFormHeader({
  // #ownProps
  errors,
  touched,
  setFieldValue,
  getFieldProps,
  values,

  //withCurrencies
  currenciesList,

  // #withAccounts
  accountsList,
  accountsTypes,

  // #withCustomers
  customers,
}) {
  const [selectedItems, setSelectedItems] = useState({});

  const handleDateChange = useCallback(
    (date) => {
      const formatted = moment(date).format('YYYY-MM-DD');
      setFieldValue('payment_date', formatted);
    },
    [setFieldValue],
  );

  // Handles change account.
  const onChangeAccount = useCallback(
    (account) => {
      setFieldValue('payment_account_id', account.id);
    },
    [setFieldValue],
  );

  const onItemsSelect = useCallback(
    (filedName) => {
      return (filed) => {
        setSelectedItems({
          ...selectedItems,
          [filedName]: filed,
        });
        setFieldValue(filedName, filed.currency_code);
      };
    },
    [setFieldValue, selectedItems],
  );

  // handle change customer
  const onChangeCustomer = useCallback(
    (filedName) => {
      return (customer) => {
        setFieldValue(filedName, customer.id);
      };
    },
    [setFieldValue],
  );

  return (
    <div className={'dashboard__insider--expense-form__header'}>
      <Row>
        <Col width={300}>
          <FormGroup
            label={<T id={'assign_to_customer'} />}
            className={classNames('form-group--select-list', Classes.FILL)}
            labelInfo={<Hint />}
            intent={errors.beneficiary && touched.beneficiary && Intent.DANGER}
            helperText={
              <ErrorMessage
                name={'assign_to_customer'}
                {...{ errors, touched }}
              />
            }
          >
            <ContactSelecetList
              contactsList={customers}
              selectedContactId={values.customer_id}
              defaultSelectText={<T id={'select_customer_account'} />}
              onContactSelected={onChangeCustomer('customer_id')}
            />
          </FormGroup>
        </Col>

        <Col width={400}>
          <FormGroup
            label={<T id={'payment_account'} />}
            className={classNames(
              'form-group--payment_account',
              'form-group--select-list',
              Classes.FILL,
            )}
            labelInfo={<FieldRequiredHint />}
            intent={
              errors.payment_account_id &&
              touched.payment_account_id &&
              Intent.DANGER
            }
            helperText={
              <ErrorMessage
                name={'payment_account_id'}
                {...{ errors, touched }}
              />
            }
          >
            <AccountsSelectList
              accounts={accountsList}
              onAccountSelected={onChangeAccount}
              defaultSelectText={<T id={'select_payment_account'} />}
              selectedAccountId={values.payment_account_id}
              filterByTypes={['current_asset']}
            />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col width={300}>
          <FormGroup
            label={<T id={'payment_date'} />}
            labelInfo={<Hint />}
            className={classNames('form-group--select-list', Classes.FILL)}
            intent={
              errors.payment_date && touched.payment_date && Intent.DANGER
            }
            helperText={
              <ErrorMessage name="payment_date" {...{ errors, touched }} />
            }
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={tansformDateValue(values.payment_date)}
              onChange={handleDateChange}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
            />
          </FormGroup>
        </Col>

        <Col width={200}>
          <FormGroup
            label={<T id={'currency'} />}
            className={classNames(
              'form-group--select-list',
              'form-group--currency',
              Classes.FILL,
            )}
            intent={
              errors.currency_code && touched.currency_code && Intent.DANGER
            }
            helperText={
              <ErrorMessage name="currency_code" {...{ errors, touched }} />
            }
          >
            <CurrencySelectList
              currenciesList={currenciesList}
              selectedCurrencyCode={values.currency_code}
              onCurrencySelected={onItemsSelect('currency_code')}
              defaultSelectText={values.currency_code}
            />
          </FormGroup>
        </Col>

        <Col width={200}>
          <FormGroup
            label={<T id={'ref_no'} />}
            className={classNames('form-group--ref_no', Classes.FILL)}
            intent={
              errors.reference_no && touched.reference_no && Intent.DANGER
            }
            helperText={
              <ErrorMessage name="reference_no" {...{ errors, touched }} />
            }
          >
            <InputGroup
              intent={
                errors.reference_no && touched.reference_no && Intent.DANGER
              }
              minimal={true}
              {...getFieldProps('reference_no')}
            />
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
}

export default compose(
  withAccounts(({ accountsList, accountsTypes }) => ({
    accountsList,
    accountsTypes,
  })),
  withCurrencies(({ currenciesList }) => ({
    currenciesList,
  })),
  withCustomers(({ customers }) => ({
    customers,
  })),
)(ExpenseFormHeader);
