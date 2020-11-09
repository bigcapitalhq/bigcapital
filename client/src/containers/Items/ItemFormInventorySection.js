import React from 'react';
import { FormGroup, Intent, InputGroup, Classes } from '@blueprintjs/core';
import { AccountsSelectList, ErrorMessage, Col, Row } from 'components';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';
import withAccounts from 'containers/Accounts/withAccounts';

import { compose } from 'utils';

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
      <Row>
        <Col xs={6}>
          <h3>
            <T id={'inventory_information'} />
          </h3>

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
              Classes.FILL,
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
            label={<T id={'opening_stock'} />}
            className={'form-group--item-stock'}
            inline={true}
          >
            <InputGroup
              medium={true}
              intent={errors.stock && Intent.DANGER}
              {...getFieldProps('stock')}
            />
          </FormGroup>

          <FormGroup
            label={'Opening average cost'}
            className={'form-group--item-stock'}
            inline={true}
          >
            <InputGroup
              medium={true}
              intent={errors.stock && Intent.DANGER}
              {...getFieldProps('stock')}
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
