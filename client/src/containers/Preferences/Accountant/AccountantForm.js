import React from 'react';
import { Form, FastField, Field } from 'formik';
import {
  FormGroup,
  RadioGroup,
  Radio,
  Checkbox,
  Button,
  Intent,
} from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { AccountsSelectList } from 'components';
import { FieldRequiredHint } from 'components';
import { FormattedMessage as T, useIntl } from 'react-intl';
// import {  } from 'common/accountTypes';
import { handleStringChange, saveInvoke } from 'utils';

import { useAccountantFormContext } from './AccountantFormProvider';



export default function AccountantForm() {
  const history = useHistory();
  const { formatMessage } = useIntl();

  const handleCloseClick = () => {
    history.go(-1);
  };

  const { accounts } = useAccountantFormContext();

  return (
    <Form>
      {/* ----------- Accounts  ----------- */}
      <FormGroup
        label={
          <strong>
            <T id={'accounts'} />
          </strong>
        }
      >
        <Checkbox
          label={'Make account code required when create a new accounts.'}
        />
        <Checkbox
          label={'Should account code be unique when create a new account.'}
        />
      </FormGroup>
      {/* ----------- Accounting basis ----------- */}
      <FastField name={'accounting_basis'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            labelInfo={<FieldRequiredHint />}
            label={
              <strong>
                <T id={'accounting_basis_'} />
              </strong>
            }
          >
            <RadioGroup inline={true}>
              <Radio label={formatMessage({ id: 'Cash' })} value="cash" />
              <Radio label={formatMessage({ id: 'accrual' })} value="accrual" />
            </RadioGroup>
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Deposit customer account ----------- */}
      <FastField name={'deposit_customer_account'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={
              <strong>
                <T id={'deposit_customer_account'} />
              </strong>
            }
            helperText={
              'Select a preferred account to deposit into it after customer make payment.'
            }
            labelInfo={<FieldRequiredHint />}
          >
            <AccountsSelectList
              accounts={accounts}
              // onAccountSelected
              defaultSelectText={<T id={'select_payment_account'} />}
              // filterByTypes={['current_asset']}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Withdrawal customer account ----------- */}
      <FastField name={'withdrawal_customer_account'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={
              <strong>
                <T id={'withdrawal_vendor_account'} />
              </strong>
            }
            helperText={
              'Select a preferred account to deposit into it after customer make payment.'
            }
            labelInfo={<FieldRequiredHint />}
          >
            <AccountsSelectList
              accounts={accounts}
              defaultSelectText={<T id={'select_payment_account'} />}
              // filterByTypes={['current_asset']}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Withdrawal customer account ----------- */}
      <FastField name={'vendor_advance_deposit'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={
              <strong>
                <T id={'customer_advance_deposit'} />
              </strong>
            }
            helperText={
              'Select a preferred account to deposit into it vendor advanced deposits.'
            }
            labelInfo={<FieldRequiredHint />}
          >
            <AccountsSelectList
              accounts={accounts}
              defaultSelectText={<T id={'select_payment_account'} />}
              // filterByTypes={['current_asset', 'other_current_asset']}
            />
          </FormGroup>
        )}
      </FastField>
      <div className={'card__footer'}>
        <Button intent={Intent.PRIMARY} type="submit">
          <T id={'save'} />
        </Button>
        <Button onClick={handleCloseClick}>
          <T id={'close'} />
        </Button>
      </div>
    </Form>
  );
}
