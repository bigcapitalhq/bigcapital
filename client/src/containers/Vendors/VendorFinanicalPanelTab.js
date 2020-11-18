import React from 'react';
import classNames from 'classnames';
import { FormGroup, Position, Classes } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FastField, ErrorMessage } from 'formik';
import { MoneyInputGroup, CurrencySelectList, Row, Col } from 'components';
import { FormattedMessage as T } from 'react-intl';

import withCurrencies from 'containers/Currencies/withCurrencies';

import {
  compose,
  momentFormatter,
  tansformDateValue,
  inputIntent,
} from 'utils';

/**
 * Vendor Finaniceal Panel Tab.
 */
function VendorFinanicalPanelTab({
  // #withCurrencies
  currenciesList,

  // #OwnProps
  vendorId,
}) {
  return (
    <div className={'tab-panel--financial'}>
      <Row>
        <Col xs={6}>
          {/*------------ Opening balance at -----------*/}
          <FastField name={'opening_balance_at'}>
            {({ form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'opening_balance_at'} />}
                className={classNames('form-group--select-list', Classes.FILL)}
                intent={inputIntent({ error, touched })}
                inline={true}
                helperText={<ErrorMessage name="opening_balance_at" />}
              >
                <DateInput
                  {...momentFormatter('YYYY/MM/DD')}
                  value={tansformDateValue(value)}
                  popoverProps={{ position: Position.BOTTOM, minimal: true }}
                  disabled={vendorId}
                />
              </FormGroup>
            )}
          </FastField>
          {/*------------ Opening balance  -----------*/}
          <FastField name={'opening_balance'}>
            {({ field, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'opening_balance'} />}
                className={classNames(
                  'form-group--opening-balance',
                  Classes.FILL,
                )}
                intent={inputIntent({ error, touched })}
                inline={true}
              >
                <MoneyInputGroup
                  value={value}
                  onChange={field.onChange}
                  prefix={'$'}
                  inputGroupProps={{
                    fill: true,
                    ...field,
                  }}
                  disabled={vendorId}
                />
              </FormGroup>
            )}
          </FastField>

          {/*------------ Currency  -----------*/}
          <FastField name={'currency_code'}>
            {({ form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'currency'} />}
                className={classNames(
                  'form-group--select-list',
                  'form-group--balance-currency',
                  Classes.FILL,
                )}
                inline={true}
              >
                <CurrencySelectList
                  currenciesList={currenciesList}
                  selectedCurrencyCode={value}
                  onCurrencySelected={(currency) => {
                    form.setFieldValue('currency_code', currency.currency_code);
                  }}
                  disabled={vendorId}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>
    </div>
  );
}

export default compose(
  withCurrencies(({ currenciesList }) => ({ currenciesList })),
)(VendorFinanicalPanelTab);
