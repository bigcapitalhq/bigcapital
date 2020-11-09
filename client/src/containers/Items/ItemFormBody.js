import React from 'react';
import {
  FormGroup,
  Intent,
  InputGroup,
  Classes,
  Checkbox,
} from '@blueprintjs/core';
import {
  AccountsSelectList,
  MoneyInputGroup,
  ErrorMessage,
  Col,
  Row,
  Hint,
} from 'components';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';
import withAccounts from 'containers/Accounts/withAccounts';

import { compose } from 'utils';

/**
 * Item form body.
 */
function ItemFormBody({
  getFieldProps,
  touched,
  errors,
  values,
  setFieldValue,

  accountsList,
}) {
  return (
    <div class="page-form__section page-form__section--selling-cost">
      <Row>
        <Col xs={6}>
          
          {/*------------- Sellable checkbox ------------- */}
          <FormGroup
            inline={true}
            className={'form-group--sellable'}
          >
            <Checkbox
              inline={true}
              label={<h3><T id={'i_purchase_this_item'} /></h3>}
              checked={values.sellable}
              {...getFieldProps('sellable')}
            />
          </FormGroup>

          {/*------------- Selling price ------------- */}
          <FormGroup
            label={<T id={'selling_price'} />}
            className={'form-group--item-selling-price'}
            intent={
              errors.selling_price && touched.selling_price && Intent.DANGER
            }
            helperText={
              <ErrorMessage {...{ errors, touched }} name="selling_price" />
            }
            inline={true}
          >
            <MoneyInputGroup
              value={values.selling_price}
              prefix={'$'}
              onChange={(e, value) => {
                setFieldValue('selling_price', value);
              }}
              inputGroupProps={{
                medium: true,
                intent:
                  errors.selling_price &&
                  touched.selling_price &&
                  Intent.DANGER,
              }}
              disabled={!values.sellable}
            />
          </FormGroup>

          {/*------------- Selling account ------------- */}
          <FormGroup
            label={<T id={'account'} />}
            labelInfo={<Hint />}
            inline={true}
            intent={
              errors.sell_account_id && touched.sell_account_id && Intent.DANGER
            }
            helperText={
              <ErrorMessage {...{ errors, touched }} name="sell_account_id" />
            }
            className={classNames(
              'form-group--sell-account',
              'form-group--select-list',
              Classes.FILL,
            )}
          >
            <AccountsSelectList
              accounts={accountsList}
              onAccountSelected={(account) => {
                setFieldValue('sell_account_id', account.id);
              }}
              defaultSelectText={<T id={'select_account'} />}
              selectedAccountId={values.sell_account_id}
              disabled={!values.sellable}
            />
          </FormGroup>

        </Col>

        <Col xs={6}>
          {/*------------- Purchasable checbox ------------- */}
          <FormGroup
            inline={true}
            className={'form-group--purchasable'}
          >
            <Checkbox
              inline={true}
              label={<h3><T id={'i_sell_this_item'} /></h3>}
              defaultChecked={values.purchasable}
              {...getFieldProps('purchasable')}
            />
          </FormGroup>

          {/*------------- Cost price ------------- */}
          <FormGroup
            label={<T id={'cost_price'} />}
            className={'form-group--item-cost-price'}
            intent={errors.cost_price && touched.cost_price && Intent.DANGER}
            helperText={
              <ErrorMessage {...{ errors, touched }} name="cost_price" />
            }
            inline={true}
          >
            <MoneyInputGroup
              value={values.cost_price}
              prefix={'$'}
              onChange={(e, value) => {
                setFieldValue('cost_price', value);
              }}
              inputGroupProps={{
                medium: true,
                intent:
                  errors.cost_price && touched.cost_price && Intent.DANGER,
              }}
              disabled={!values.purchasable}
            />
          </FormGroup>

          {/*------------- Cost account ------------- */}
          <FormGroup
            label={<T id={'account'} />}
            labelInfo={<Hint />}
            inline={true}
            intent={
              errors.cost_account_id && touched.cost_account_id && Intent.DANGER
            }
            helperText={
              <ErrorMessage {...{ errors, touched }} name="cost_account_id" />
            }
            className={classNames(
              'form-group--cost-account',
              'form-group--select-list',
              Classes.FILL,
            )}
          >
            <AccountsSelectList
              accounts={accountsList}
              onAccountSelected={(account) => {
                setFieldValue('cost_account_id', account.id)
              }}
              defaultSelectText={<T id={'select_account'} />}
              selectedAccountId={values.cost_account_id}
              disabled={!values.purchasable}
            />
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
}

export default compose(
  withAccounts(({ accountsList }) => ({
    accountsList,
  })),
)(ItemFormBody);