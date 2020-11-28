import React from 'react';
import { FastField, Field, ErrorMessage } from 'formik';
import { FormGroup, Classes, Checkbox, ControlGroup } from '@blueprintjs/core';
import {
  AccountsSelectList,
  MoneyInputGroup,
  Col,
  Row,
  Hint,
  InputPrependText,
} from 'components';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';

import withAccounts from 'containers/Accounts/withAccounts';
import withSettings from 'containers/Settings/withSettings';

import { compose, inputIntent } from 'utils';

/**
 * Item form body.
 */
function ItemFormBody({ accountsList, baseCurrency }) {
  return (
    <div class="page-form__section page-form__section--selling-cost">
      <Row>
        <Col xs={6}>
          {/*------------- Purchasable checbox ------------- */}
          <FastField name={'sellable'} type="checkbox">
            {({ form, field }) => (
              <FormGroup inline={true} className={'form-group--sellable'}>
                <Checkbox
                  inline={true}
                  label={
                    <h3>
                      <T id={'i_sell_this_item'} />
                    </h3>
                  }
                  name={'sellable'}
                  {...field}
                />
              </FormGroup>
            )}
          </FastField>

          {/*------------- Selling price ------------- */}
          <FastField name={'sell_price'}>
            {({ form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'selling_price'} />}
                className={'form-group--sell_price'}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name={'sell_price'} />}
                inline={true}
              >
                <ControlGroup>
                  <InputPrependText text={baseCurrency} />
                  <MoneyInputGroup
                    value={value}
                    prefix={'$'}
                    inputGroupProps={{ fill: true }}
                    disabled={!form.values.sellable}
                    onChange={(unformattedValue) => {
                      form.setFieldValue('sell_price', unformattedValue);
                    }}
                  />
                </ControlGroup>
              </FormGroup>
            )}
          </FastField>

          {/*------------- Selling account ------------- */}
          <FastField name={'sell_account_id'}>
            {({ form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'account'} />}
                labelInfo={<Hint />}
                inline={true}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="sell_account_id" />}
                className={classNames(
                  'form-group--sell-account',
                  'form-group--select-list',
                  Classes.FILL,
                )}
              >
                <AccountsSelectList
                  accounts={accountsList}
                  onAccountSelected={(account) => {
                    form.setFieldValue('sell_account_id', account.id);
                  }}
                  defaultSelectText={<T id={'select_account'} />}
                  selectedAccountId={value}
                  disabled={!form.values.sellable}
                  filterByTypes={['income']}
                  popoverFill={true}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>

        <Col xs={6}>
          {/*------------- Sellable checkbox ------------- */}
          <FastField name={'purchasable'} type={'checkbox'}>
            {({ field }) => (
              <FormGroup inline={true} className={'form-group--purchasable'}>
                <Checkbox
                  inline={true}
                  label={
                    <h3>
                      <T id={'i_purchase_this_item'} />
                    </h3>
                  }
                  {...field}
                />
              </FormGroup>
            )}
          </FastField>

          {/*------------- Cost price ------------- */}
          <FastField name={'cost_price'}>
            {({ field, form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'cost_price'} />}
                className={'form-group--item-cost-price'}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="cost_price" />}
                inline={true}
              >
                <ControlGroup>
                  <InputPrependText text={baseCurrency} />
                  <MoneyInputGroup
                    value={value}
                    prefix={'$'}
                    inputGroupProps={{ medium: true }}
                    disabled={!form.values.purchasable}
                    onChange={(unformattedValue) => {
                      form.setFieldValue('cost_price', unformattedValue);
                    }}
                  />
                </ControlGroup>
              </FormGroup>
            )}
          </FastField>

          {/*------------- Cost account ------------- */}
          <FastField name={'cost_account_id'}>
            {({ form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'account'} />}
                labelInfo={<Hint />}
                inline={true}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="cost_account_id" />}
                className={classNames(
                  'form-group--cost-account',
                  'form-group--select-list',
                  Classes.FILL,
                )}
              >
                <AccountsSelectList
                  accounts={accountsList}
                  onAccountSelected={(account) => {
                    form.setFieldValue('cost_account_id', account.id);
                  }}
                  defaultSelectText={<T id={'select_account'} />}
                  selectedAccountId={value}
                  disabled={!form.values.purchasable}
                  filterByTypes={['cost_of_goods_sold']}
                  popoverFill={true}
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
  withAccounts(({ accountsList }) => ({
    accountsList,
  })),
  withSettings(({ organization }) => ({
    baseCurrency: 'USD',
  })),
)(ItemFormBody);
