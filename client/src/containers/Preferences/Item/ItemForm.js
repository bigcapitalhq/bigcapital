import React from 'react';
import { Form, FastField, useFormikContext } from 'formik';
import { FormGroup, Button, Intent } from '@blueprintjs/core';
import { AccountsSelectList, FieldRequiredHint } from 'components';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { inputIntent } from 'utils';
import { ACCOUNT_PARENT_TYPE, ACCOUNT_TYPE } from 'common/accountTypes';

import { useItemFormContext } from './ItemFormProvider';

/**
 * item form preferences.
 */
export default function ItemForm() {
  const history = useHistory();
  const { accounts } = useItemFormContext();

  const { isSubmitting } = useFormikContext();

  const handleCloseClick = () => {
    history.go(-1);
  };

  return (
    <Form>
      {/* ----------- preferred sell account ----------- */}
      <FastField name={'sell_account'}>
        {({
          form: { values, setFieldValue },
          field: { value },
          meta: { error, touched },
        }) => (
          <FormGroup
            label={
              <strong>
                <T id={'preferred_sell_account'} />
              </strong>
            }
            helperText={
              <T
                id={
                  'select_a_preferred_account_to_deposit_into_it_after_customer_make_payment'
                }
              />
            }
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
          >
            <AccountsSelectList
              accounts={accounts}
              onAccountSelected={({ id }) => {
                setFieldValue('sell_account', id);
              }}
              selectedAccountId={value}
              defaultSelectText={<T id={'select_payment_account'} />}
              filterByParentTypes={[ACCOUNT_PARENT_TYPE.INCOME]}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------- preferred cost account ----------- */}
      <FastField name={'cost_account'}>
        {({
          form: { values, setFieldValue },
          field: { value },
          meta: { error, touched },
        }) => (
          <FormGroup
            label={
              <strong>
                <T id={'preferred_cost_account'} />
              </strong>
            }
            helperText={
              <T
                id={
                  'select_a_preferred_account_to_deposit_into_it_after_customer_make_payment'
                }
              />
            }
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
          >
            <AccountsSelectList
              accounts={accounts}
              onAccountSelected={({ id }) => {
                setFieldValue('cost_account', id);
              }}
              selectedAccountId={value}
              defaultSelectText={<T id={'select_payment_account'} />}
              filterByParentTypes={[ACCOUNT_PARENT_TYPE.EXPENSE]}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------- preferred inventory account ----------- */}
      <FastField name={'inventory_account'}>
        {({
          form: { values, setFieldValue },
          field: { value },
          meta: { error, touched },
        }) => (
          <FormGroup
            label={
              <strong>
                <T id={'preferred_inventory_account'} />
              </strong>
            }
            helperText={
              <T
                id={
                  'select_a_preferred_account_to_deposit_into_it_vendor_advanced_deposits'
                }
              />
            }
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
          >
            <AccountsSelectList
              accounts={accounts}
              onAccountSelected={({ id }) => {
                setFieldValue('inventory_account', id);
              }}
              selectedAccountId={value}
              defaultSelectText={<T id={'select_payment_account'} />}
              filterByTypes={[ACCOUNT_TYPE.INVENTORY]}
            />
          </FormGroup>
        )}
      </FastField>

      <div className={'card__footer'}>
        <Button intent={Intent.PRIMARY} disabled={isSubmitting} type="submit">
          <T id={'save'} />
        </Button>
        <Button onClick={handleCloseClick}>
          <T id={'close'} />
        </Button>
      </div>
    </Form>
  );
}
