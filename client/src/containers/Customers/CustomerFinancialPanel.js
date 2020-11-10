import React, { useCallback, useState } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { FormGroup, Intent, Position, Classes } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import {
  ErrorMessage,
  MoneyInputGroup,
  CurrencySelectList,
  Row,
  Col,
} from 'components';
import { FormattedMessage as T } from 'react-intl';

import withCurrencies from 'containers/Currencies/withCurrencies';

import { compose, momentFormatter, tansformDateValue } from 'utils';

function CustomerFinancialPanel({
  setFieldValue,
  errors,
  touched,
  values,

  // #withCurrencies
  currenciesList,

  customerId,
}) {
  const [selectedItems, setSelectedItems] = useState();

  const handleDateChange = useCallback(
    (date) => {
      const formatted = moment(date).format('YYYY-MM-DD');
      setFieldValue('opening_balance_at', formatted);
    },
    [setFieldValue],
  );

  const handleMoneyInputChange = useCallback(
    (e, value) => {
      setFieldValue('opening_balance', value);
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
    <div className={'tab-panel--financial'}>
      <Row>
        <Col xs={6}>
          {/*------------ Opening balance at -----------*/}
          <FormGroup
            label={<T id={'opening_balance_at'} />}
            className={classNames('form-group--select-list', Classes.FILL)}
            intent={
              errors.opening_balance_at &&
              touched.opening_balance_at &&
              Intent.DANGER
            }
            inline={true}
            helperText={
              <ErrorMessage
                name="opening_balance_at"
                {...{ errors, touched }}
              />
            }
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={tansformDateValue(values.opening_balance_at)}
              onChange={handleDateChange}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              disabled={customerId}
            />
          </FormGroup>
          {/*------------ Opening balance  -----------*/}
          <FormGroup
            label={<T id={'opening_balance'} />}
            className={classNames('form-group--opening-balance', Classes.FILL)}
            intent={
              errors.opening_balance && touched.opening_balance && Intent.DANGER
            }
            inline={true}
          >
            <MoneyInputGroup
              value={values.opening_balance}
              prefix={'$'}
              onChange={handleMoneyInputChange}
              inputGroupProps={{
                fill: true,
              }}
              disabled={customerId}
            />
          </FormGroup>
          {/*------------ Currency  -----------*/}
          <FormGroup
            label={<T id={'currency'} />}
            className={classNames(
              'form-group--select-list',
              'form-group--balance-currency',
              Classes.FILL,
            )}
            inline={true}
          >
            {/* <CurrenciesSelectList /> */}
            <CurrencySelectList
              currenciesList={currenciesList}
              selectedCurrencyCode={values.currency_code}
              onCurrencySelected={onItemsSelect('currency_code')}
              disabled={customerId}
            />
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
}

export default compose(
  withCurrencies(({ currenciesList }) => ({ currenciesList })),
)(CustomerFinancialPanel);
