import React from 'react';
import { Form, FastField, useFormikContext } from 'formik';
import {
  FormGroup,
  RadioGroup,
  Radio,
  Checkbox,
  Button,
  Intent,
} from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { AccountsSelectList, FieldRequiredHint } from 'components';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { handleStringChange, inputIntent } from 'utils';

import { useAccountantFormContext } from './AccountantFormProvider';

/**
 * Accountant form.
 */
export default function AccountantForm() {
  const history = useHistory();

  const { formatMessage } = useIntl();

  const { isSubmitting } = useFormikContext();

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
        className={'accounts-checkbox'}
      >
        {/*------------ account code required -----------*/}
        <FastField name={'account_code_required'} type={'checkbox'}>
          {({ field }) => (
            <FormGroup inline={true}>
              <Checkbox
                inline={true}
                label={'Make account code required when create a new accounts.'}
                name={'account_code_required'}
                {...field}
              />
            </FormGroup>
          )}
        </FastField>
        {/*------------ account code unique -----------*/}
        <FastField name={'account_code_unique'} type={'checkbox'}>
          {({ field }) => (
            <FormGroup inline={true}>
              <Checkbox
                inline={true}
                label={
                  'Should account code be unique when create a new account.'
                }
                name={'account_code_unique'}
                {...field}
              />
            </FormGroup>
          )}
        </FastField>
      </FormGroup>
      {/* ----------- Accounting basis ----------- */}
      <FastField name={'accounting_basis'}>
        {({
          form: { setFieldValue },
          field: { value },
          meta: { error, touched },
        }) => (
          <FormGroup
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            label={
              <strong>
                <T id={'accounting_basis_'} />
              </strong>
            }
          >
            <RadioGroup
              inline={true}
              selectedValue={value}
              onChange={handleStringChange((_value) => {
                setFieldValue('accounting_basis', _value);
              })}
            >
              <Radio label={formatMessage({ id: 'Cash' })} value="cash" />
              <Radio label={formatMessage({ id: 'accrual' })} value="accrual" />
            </RadioGroup>
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Deposit customer account ----------- */}
      <FastField name={'deposit_account'}>
        {({
          form: { values, setFieldValue },
          field: { value },
          meta: { error, touched },
        }) => (
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
            intent={inputIntent({ error, touched })}
          >
            <AccountsSelectList
              accounts={accounts}
              onAccountSelected={({ id }) => {
                setFieldValue('deposit_account', id);
              }}
              selectedAccountId={value}
              defaultSelectText={<T id={'select_payment_account'} />}
              // filterByParentTypes={[ACCOUNT_PARENT_TYPE.CURRENT_ASSET]}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Withdrawal vendor account ----------- */}
      <FastField name={'withdrawal_account'}>
        {({
          form: { values, setFieldValue },
          field: { value },
          meta: { error, touched },
        }) => (
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
            intent={inputIntent({ error, touched })}
          >
            <AccountsSelectList
              accounts={accounts}
              onAccountSelected={({ id }) => {
                setFieldValue('withdrawal_account', id);
              }}
              selectedAccountId={value}
              defaultSelectText={<T id={'select_payment_account'} />}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Withdrawal customer account ----------- */}
      <FastField name={'advance_deposit'}>
        {({
          form: { values, setFieldValue },
          field: { value },
          meta: { error, touched },
        }) => (
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
            intent={inputIntent({ error, touched })}
          >
            <AccountsSelectList
              accounts={accounts}
              onAccountSelected={({ id }) => {
                setFieldValue('advance_deposit', id);
              }}
              selectedAccountId={value}
              defaultSelectText={<T id={'select_payment_account'} />}
              // filterByParentTypes={[ACCOUNT_PARENT_TYPE.CURRENT_ASSET]}
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
