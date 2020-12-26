import React from 'react';
import { FastField, ErrorMessage } from 'formik';
import {
  FormGroup,
  InputGroup,
  ControlGroup,
  Position,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import {
  AccountsSelectList,
  MoneyInputGroup,
  InputPrependText,
  Col,
  Row,
  Hint,
} from 'components';
import { CLASSES } from 'common/classes';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';
import withAccounts from 'containers/Accounts/withAccounts';
import withSettings from 'containers/Settings/withSettings';
import {
  compose,
  tansformDateValue,
  momentFormatter,
  inputIntent,
  handleDateChange,
} from 'utils';

/**
 * Item form inventory sections.
 */
function ItemFormInventorySection({ accountsList, baseCurrency }) {
  return (
    <div class="page-form__section page-form__section--inventory">
      <h3>
        <T id={'inventory_information'} />
      </h3>

      <Row>
        <Col xs={6}>
          {/*------------- Inventory account ------------- */}
          <FastField name={'inventory_account_id'}>
            {({ form, field: { value }, meta: { touched, error } }) => (
              <FormGroup
                label={<T id={'inventory_account'} />}
                inline={true}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="inventory_account_id" />}
                className={classNames(
                  'form-group--item-inventory_account',
                  'form-group--select-list',
                  CLASSES.FILL,
                )}
              >
                <AccountsSelectList
                  accounts={accountsList}
                  onAccountSelected={(account) => {
                    form.setFieldValue('inventory_account_id', account.id);
                  }}
                  defaultSelectText={<T id={'select_account'} />}
                  selectedAccountId={value}
                />
              </FormGroup>
            )}
          </FastField>

          {/*------------- Opening quantity ------------- */}
          <FastField name={'opening_quantity'}>
            {({ field, meta: { touched, error } }) => (
              <FormGroup
                label={<T id={'opening_quantity'} />}
                labelInfo={<Hint />}
                className={'form-group--opening_quantity'}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name={'opening_quantity'} />}
                inline={true}
              >
                <InputGroup medium={true} {...field} />
              </FormGroup>
            )}
          </FastField>

          {/*------------- Opening date ------------- */}
          <FastField name={'opening_date'}>
            {({ form, field: { value }, meta: { touched, error } }) => (
              <FormGroup
                label={<T id={'opening_date'} />}
                labelInfo={<Hint />}
                className={classNames(
                  'form-group--select-list',
                  'form-group--opening_date',
                  CLASSES.FILL,
                )}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name={'opening_date'} />}
                inline={true}
              >
                <DateInput
                  {...momentFormatter('YYYY/MM/DD')}
                  value={tansformDateValue(value)}
                  onChange={handleDateChange((value) => {
                    form.setFieldValue('opening_date', value);
                  })}
                  helperText={<ErrorMessage name={'opening_date'} />}
                  popoverProps={{ position: Position.BOTTOM, minimal: true }}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>

        {/*------------- Opening cost ------------- */}
        <Col xs={6}>
          <FastField name={'opening_cost'}>
            {({ form, field: { value }, meta: { touched, error } }) => (
              <FormGroup
                label={<T id={'opening_average_cost'} />}
                labelInfo={<Hint />}
                className={'form-group--opening_cost'}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name={'opening_cost'} />}
                inline={true}
              >
                <ControlGroup>
                  <InputPrependText text={baseCurrency} />
                  <MoneyInputGroup
                    value={value}
                    inputGroupProps={{ fill: true }}
                    onChange={(unformattedValue) => {
                      form.setFieldValue('opening_cost', unformattedValue);
                    }}
                  />
                </ControlGroup>
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>
    </div>
  );
}

export default compose(
  withAccounts(({ accountsList }) => ({
    accountsList,
  })),
  withSettings(({ organizationSettings }) => ({
    baseCurrency: organizationSettings?.baseCurrency,
  })),
)(ItemFormInventorySection);
