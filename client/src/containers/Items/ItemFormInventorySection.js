import React from 'react';
import { FastField, ErrorMessage } from 'formik';
import { FormGroup, InputGroup, Position } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { AccountsSelectList, Col, Row, Hint } from 'components';
import { CLASSES } from 'common/classes';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';
import withAccounts from 'containers/Accounts/withAccounts';
import { compose, tansformDateValue, momentFormatter, inputIntent } from 'utils';

/**
 * Item form inventory sections.
 */
function ItemFormInventorySection({ accountsList }) {
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

          <FastField name={'opening_quantity'}>
            {({ field, field: { value }, meta: { touched, error } }) => (
              <FormGroup
                label={<T id={'opening_quantity'} />}
                labelInfo={<Hint />}
                className={'form-group--opening_quantity'}
                intent={inputIntent({ error, touched })}
                inline={true}
              >
                <InputGroup
                  medium={true}
                  {...field}
                />
              </FormGroup>
            )}
          </FastField>

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
                inline={true}
              >
                <DateInput
                  {...momentFormatter('YYYY/MM/DD')}
                  value={tansformDateValue(value)}
                  onChange={(value) => {
                    form.setFieldValue('opening_date', value);
                  }}
                  popoverProps={{ position: Position.BOTTOM, minimal: true }}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>

        <Col xs={6}>
          <FastField name={'opening_average_rate'}>
            {({ field, field: { value }, meta: { touched, error } }) => (
              <FormGroup
                label={'Opening average rate'}
                labelInfo={<Hint />}
                className={'form-group--opening_average_rate'}
                intent={inputIntent({ error, touched })}
                inline={true}
              >
                <InputGroup
                  medium={true}
                  {...field}
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
)(ItemFormInventorySection);
