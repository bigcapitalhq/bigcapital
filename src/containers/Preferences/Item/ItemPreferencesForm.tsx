import React from 'react';
import { Form, FastField, useFormikContext } from 'formik';
import { FormGroup, Button, Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import {
  AccountsSelectList,
  FieldRequiredHint,
  FormattedMessage as T,
  CardFooterActions
} from '@/components';
import { inputIntent } from '@/utils';
import { ACCOUNT_PARENT_TYPE, ACCOUNT_TYPE } from '@/common/accountTypes';

import { useItemPreferencesFormContext } from './ItemPreferencesFormProvider';

/**
 * Item preferences form.
 */
export default function ItemForm() {
  const history = useHistory();
  const { accounts } = useItemPreferencesFormContext();

  const { isSubmitting } = useFormikContext();

  const handleCloseClick = () => {
    history.go(-1);
  };

  return (
    <Form>
      {/* ----------- preferred sell account ----------- */}
      <FastField name={'preferred_sell_account'}>
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
                setFieldValue('preferred_sell_account', id);
              }}
              selectedAccountId={value}
              defaultSelectText={<T id={'select_payment_account'} />}
              filterByParentTypes={[ACCOUNT_PARENT_TYPE.INCOME]}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------- preferred cost account ----------- */}
      <FastField name={'preferred_cost_account'}>
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
                setFieldValue('preferred_cost_account', id);
              }}
              selectedAccountId={value}
              defaultSelectText={<T id={'select_payment_account'} />}
              filterByParentTypes={[ACCOUNT_PARENT_TYPE.EXPENSE]}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------- preferred inventory account ----------- */}
      <FastField name={'preferred_inventory_account'}>
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
                setFieldValue('preferred_inventory_account', id);
              }}
              selectedAccountId={value}
              defaultSelectText={<T id={'select_payment_account'} />}
              filterByTypes={[ACCOUNT_TYPE.INVENTORY]}
            />
          </FormGroup>
        )}
      </FastField>

      <CardFooterActions>
        <Button intent={Intent.PRIMARY} loading={isSubmitting} type="submit">
          <T id={'save'} />
        </Button>
        <Button onClick={handleCloseClick} disabled={isSubmitting}>
          <T id={'close'} />
        </Button>
      </CardFooterActions>
    </Form>
  );
}
