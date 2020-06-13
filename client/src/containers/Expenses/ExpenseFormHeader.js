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
import { momentFormatter, compose } from 'utils';

import classNames from 'classnames';
import Icon from 'components/Icon';
import ErrorMessage from 'components/ErrorMessage';
import { ListSelect } from 'components';
import withCurrencies from 'containers/Currencies/withCurrencies';
import withAccounts from 'containers/Accounts/withAccounts';

function ExpenseFormHeader({
  formik: { errors, touched, setFieldValue, getFieldProps, values },
  currenciesList,
  accounts,
}) {
  const [selectedItems, setSelectedItems] = useState({});

  const handleDateChange = useCallback(
    (date) => {
      const formatted = moment(date).format('YYYY-MM-DD');
      setFieldValue('payment_date', formatted);
    },
    [setFieldValue],
  );

  const infoIcon = useMemo(() => <Icon icon="info-circle" iconSize={12} />, []);

  const requiredSpan = useMemo(() => <span className="required">*</span>, []);

  const currencyCodeRenderer = useCallback((item, { handleClick }) => {
    return (
      <MenuItem key={item.id} text={item.currency_code} onClick={handleClick} />
    );
  }, []);

  // Filters Currency code.
  const filterCurrencyCode = (query, currency, _index, exactMatch) => {
    const normalizedTitle = currency.currency_code.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return (
        `${currency.currency_code} ${normalizedTitle}`.indexOf(
          normalizedQuery,
        ) >= 0
      );
    }
  };

  // Account item of select accounts field.
  const accountItem = (item, { handleClick }) => {
    return (
      <MenuItem
        key={item.id}
        text={item.name}
        label={item.code}
        onClick={handleClick}
      />
    );
  };

  // Filters accounts items.
  const filterAccountsPredicater = useCallback(
    (query, account, _index, exactMatch) => {
      const normalizedTitle = account.name.toLowerCase();
      const normalizedQuery = query.toLowerCase();

      if (exactMatch) {
        return normalizedTitle === normalizedQuery;
      } else {
        return (
          `${account.code} ${normalizedTitle}`.indexOf(normalizedQuery) >= 0
        );
      }
    },
    [],
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

  return (
    <div className={'dashboard__insider--expense-form__header'}>
      <Row>
        <Col sm={3.5}>
          <FormGroup
            label={<T id={'beneficiary'} />}
            className={classNames('form-group--select-list', Classes.FILL)}
            labelInfo={infoIcon}
            intent={errors.beneficiary && touched.beneficiary && Intent.DANGER}
            helperText={
              <ErrorMessage name={'beneficiary'} {...{ errors, touched }} />
            }
          >
            <ListSelect
              items={[]}
              noResults={<MenuItem disabled={true} text="No results." />}
              // itemRenderer={}
              // itemPredicate={}
              popoverProps={{ minimal: true }}
              // onItemSelect={}
              selectedItem={values.beneficiary}
              // selectedItemProp={'id'}
              defaultText={<T id={'select_beneficiary_account'} />}
              labelProp={'beneficiary'}
            />
          </FormGroup>
        </Col>
        <Col sm={3}>
          <FormGroup
            label={<T id={'payment_account'} />}
            className={classNames(
              'form-group--payment_account',
              'form-group--select-list',
              Classes.FILL,
            )}
            labelInfo={requiredSpan}
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
            <ListSelect
              items={accounts}
              noResults={<MenuItem disabled={true} text="No results." />}
              itemRenderer={accountItem}
              itemPredicate={filterAccountsPredicater}
              popoverProps={{ minimal: true }}
              onItemSelect={onChangeAccount}
              selectedItem={values.payment_account_id}
              selectedItemProp={'id'}
              defaultText={<T id={'select_payment_account'} />}
              labelProp={'name'}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col sm={3.5}>
          <FormGroup
            label={<T id={'payment_date'} />}
            labelInfo={infoIcon}
            className={classNames('form-group--select-list', Classes.FILL)}
            intent={
              errors.payment_date && touched.payment_date && Intent.DANGER
            }
            helperText={
              <ErrorMessage name="payment_date" {...{ errors, touched }} />
            }
            minimal={true}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              defaultValue={new Date()}
              onChange={handleDateChange}
              popoverProps={{ position: Position.BOTTOM }}
            />
          </FormGroup>
        </Col>
        <Col sm={2}>
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
            <ListSelect
              items={currenciesList}
              noResults={<MenuItem disabled={true} text="No results." />}
              itemRenderer={currencyCodeRenderer}
              itemPredicate={filterCurrencyCode}
              popoverProps={{ minimal: true }}
              onItemSelect={onItemsSelect('currency_code')}
              selectedItem={values.currency_code}
              selectedItemProp={'currency_code'}
              defaultText={<T id={'select_currency_code'} />}
              labelProp={'currency_code'}
            />
          </FormGroup>
        </Col>

        <Col sm={3}>
          <FormGroup
            label={<T id={'ref_no'} />}
            className={'form-group--ref_no'}
            intent={
              errors.reference_no && touched.reference_no && Intent.DANGER
            }
            helperText={
              <ErrorMessage name="reference_no" {...{ errors, touched }} />
            }
            minimal={true}
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
  withAccounts(({ accounts }) => ({
    accounts,
  })),
  withCurrencies(({ currenciesList }) => ({
    currenciesList,
  })),
)(ExpenseFormHeader);
