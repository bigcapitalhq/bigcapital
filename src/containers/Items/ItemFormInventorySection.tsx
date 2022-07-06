import React from 'react';
import { FastField, ErrorMessage } from 'formik';
import { FormGroup } from '@blueprintjs/core';
import { CLASSES } from '@/common/classes';
import {
  AccountsSelectList,
  FormattedMessage as T,
  Col,
  Row,
} from '@/components';
import classNames from 'classnames';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

import { accountsFieldShouldUpdate } from './utils';
import { compose, inputIntent } from '@/utils';
import { ACCOUNT_TYPE } from '@/common/accountTypes';
import { useItemFormContext } from './ItemFormProvider';

/**
 * Item form inventory sections.
 */
function ItemFormInventorySection({ organization: { base_currency } }) {
  const { accounts } = useItemFormContext();

  return (
    <div class="page-form__section page-form__section--inventory">
      <h3>
        <T id={'inventory_information'} />
      </h3>

      <Row>
        <Col xs={6}>
          {/*------------- Inventory account ------------- */}
          <FastField
            name={'inventory_account_id'}
            accounts={accounts}
            shouldUpdate={accountsFieldShouldUpdate}
          >
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
                  accounts={accounts}
                  onAccountSelected={(account) => {
                    form.setFieldValue('inventory_account_id', account.id);
                  }}
                  defaultSelectText={<T id={'select_account'} />}
                  selectedAccountId={value}
                  filterByTypes={[ACCOUNT_TYPE.INVENTORY]}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>
    </div>
  );
}

export default compose(withCurrentOrganization())(ItemFormInventorySection);
