import React, { useCallback } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { FormGroup, Intent, Position, Classes } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import {
  ErrorMessage,
  MoneyInputGroup,
  CurrenciesSelectList,
  Row,
  Col,
} from 'components';
import { FormattedMessage as T } from 'react-intl';
import { momentFormatter, tansformDateValue } from 'utils';

export default function CustomerFinancialPanel({
  setFieldValue,
  errors,
  touched,
  values,
}) {
  const handleDateChange = useCallback(
    (date) => {
      const formatted = moment(date).format('YYYY-MM-DD');
      setFieldValue('payment_date', formatted);
    },
    [setFieldValue],
  );

  return (
    <div className={'customer-form__tabs-section customer-form__tabs-section--financial'}>
      <Row>
        <Col xs={6}>
          <FormGroup
            label={<T id={'opening_balance_at'} />}
            className={classNames('form-group--select-list', Classes.FILL)}
            intent={
              errors.opening_balance_date &&
              touched.opening_balance_date &&
              Intent.DANGER
            }
            inline={true}
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
              inputGroupProps={{
                fill: true,
              }}
            />
          </FormGroup>

          <FormGroup
            label={<T id={'currency'} />}
            className={classNames(
              'form-group--select-list',
              'form-group--balance-currency',
              Classes.FILL,
            )}
            inline={true}
          >
            <CurrenciesSelectList />
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
}
