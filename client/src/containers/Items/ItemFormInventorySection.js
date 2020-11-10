import React from 'react';
import {
  FormGroup,
  Intent,
  InputGroup,
  Position,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { AccountsSelectList, ErrorMessage, Col, Row, Hint } from 'components';
import { CLASSES } from 'common/classes';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';
import withAccounts from 'containers/Accounts/withAccounts';
import { compose, tansformDateValue, momentFormatter } from 'utils';

/**
 * Item form inventory sections.
 */
function ItemFormInventorySection({
  errors,
  touched,
  setFieldValue,
  values,
  getFieldProps,

  accountsList,
}) {
  return (
    <div class="page-form__section page-form__section--inventory">
      <h3>
        <T id={'inventory_information'} />
      </h3>

      <Row>
        <Col xs={6}>
          {/*------------- Inventory account ------------- */}
          <FormGroup
            label={<T id={'inventory_account'} />}
            inline={true}
            intent={
              errors.inventory_account_id &&
              touched.inventory_account_id &&
              Intent.DANGER
            }
            helperText={
              <ErrorMessage
                {...{ errors, touched }}
                name="inventory_account_id"
              />
            }
            className={classNames(
              'form-group--item-inventory_account',
              'form-group--select-list',
              CLASSES.FILL,
            )}
          >
            <AccountsSelectList
              accounts={accountsList}
              onAccountSelected={(account) => {
                setFieldValue('inventory_account_id', account.id);
              }}
              defaultSelectText={<T id={'select_account'} />}
              selectedAccountId={values.inventory_account_id}
            />
          </FormGroup>

          <FormGroup
            label={<T id={'opening_quantity'} />}
            labelInfo={<Hint />}
            className={'form-group--opening_quantity'}
            inline={true}
          >
            <InputGroup
              medium={true}
              intent={errors.opening_quantity && Intent.DANGER}
              {...getFieldProps('opening_quantity')}
            />
          </FormGroup>

          <FormGroup
            label={<T id={'opening_date'} />}
            labelInfo={<Hint />}
            className={classNames(
              'form-group--select-list',
              'form-group--opening_date',
              CLASSES.FILL,
            )}
            inline={true}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={tansformDateValue(values.payment_date)}
              onChange={(value) => {
                setFieldValue('opening_date', value);
              }}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
            />
          </FormGroup>
        </Col>

        <Col xs={6}>
          <FormGroup
            label={'Opening average rate'}
            labelInfo={<Hint />}
            className={'form-group--opening_average_rate'}
            inline={true}
          >
            <InputGroup
              medium={true}
              intent={errors.opening_average_rate && Intent.DANGER}
              {...getFieldProps('opening_average_rate')}
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
)(ItemFormInventorySection);
