import React from 'react';
import { useFormikContext, FastField, ErrorMessage } from 'formik';
import {
  FormGroup,
  Classes,
  TextArea,
  Checkbox,
  ControlGroup,
} from '@blueprintjs/core';
import {
  AccountsSelectList,
  MoneyInputGroup,
  Col,
  Row,
  Hint,
  InputPrependText,
} from '@/components';
import { FormattedMessage as T } from '@/components';
import classNames from 'classnames';

import { useItemFormContext } from './ItemFormProvider';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';
import { ACCOUNT_PARENT_TYPE } from '@/common/accountTypes';
import {
  sellDescriptionFieldShouldUpdate,
  sellAccountFieldShouldUpdate,
  sellPriceFieldShouldUpdate,
  costPriceFieldShouldUpdate,
  costAccountFieldShouldUpdate,
  purchaseDescFieldShouldUpdate,
} from './utils';
import { compose, inputIntent } from '@/utils';

/**
 * Item form body.
 */
function ItemFormBody({ organization: { base_currency } }) {
  const { accounts } = useItemFormContext();
  const { values } = useFormikContext();

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
          <FastField
            name={'sell_price'}
            sellable={values.sellable}
            shouldUpdate={sellPriceFieldShouldUpdate}
          >
            {({ form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'selling_price'} />}
                className={'form-group--sell_price'}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name={'sell_price'} />}
                inline={true}
              >
                <ControlGroup>
                  <InputPrependText text={base_currency} />
                  <MoneyInputGroup
                    value={value}
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
          <FastField
            name={'sell_account_id'}
            sellable={values.sellable}
            accounts={accounts}
            shouldUpdate={sellAccountFieldShouldUpdate}
          >
            {({ form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'account'} />}
                labelInfo={
                  <Hint content={<T id={'item.field.sell_account.hint'} />} />
                }
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
                  accounts={accounts}
                  onAccountSelected={(account) => {
                    form.setFieldValue('sell_account_id', account.id);
                  }}
                  defaultSelectText={<T id={'select_account'} />}
                  selectedAccountId={value}
                  disabled={!form.values.sellable}
                  filterByParentTypes={[ACCOUNT_PARENT_TYPE.INCOME]}
                  popoverFill={true}
                  allowCreate={true}
                />
              </FormGroup>
            )}
          </FastField>

          <FastField
            name={'sell_description'}
            sellable={values.sellable}
            shouldUpdate={sellDescriptionFieldShouldUpdate}
          >
            {({ form: { values }, field, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'description'} />}
                className={'form-group--sell-description'}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name={'description'} />}
                inline={true}
              >
                <TextArea
                  growVertically={true}
                  height={280}
                  {...field}
                  disabled={!values.sellable}
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
          <FastField
            name={'cost_price'}
            purchasable={values.purchasable}
            shouldUpdate={costPriceFieldShouldUpdate}
          >
            {({ field, form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'cost_price'} />}
                className={'form-group--item-cost-price'}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="cost_price" />}
                inline={true}
              >
                <ControlGroup>
                  <InputPrependText text={base_currency} />
                  <MoneyInputGroup
                    value={value}
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
          <FastField
            name={'cost_account_id'}
            purchasable={values.purchasable}
            accounts={accounts}
            shouldUpdate={costAccountFieldShouldUpdate}
          >
            {({ form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'account'} />}
                labelInfo={
                  <Hint content={<T id={'item.field.cost_account.hint'} />} />
                }
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
                  accounts={accounts}
                  onAccountSelected={(account) => {
                    form.setFieldValue('cost_account_id', account.id);
                  }}
                  defaultSelectText={<T id={'select_account'} />}
                  selectedAccountId={value}
                  disabled={!form.values.purchasable}
                  filterByParentTypes={[ACCOUNT_PARENT_TYPE.EXPENSE]}
                  popoverFill={true}
                  allowCreate={true}
                />
              </FormGroup>
            )}
          </FastField>

          <FastField
            name={'purchase_description'}
            purchasable={values.purchasable}
            shouldUpdate={purchaseDescFieldShouldUpdate}
          >
            {({ form: { values }, field, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'description'} />}
                className={'form-group--purchase-description'}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name={'description'} />}
                inline={true}
              >
                <TextArea
                  growVertically={true}
                  height={280}
                  {...field}
                  disabled={!values.purchasable}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>
    </div>
  );
}

export default compose(withCurrentOrganization())(ItemFormBody);
