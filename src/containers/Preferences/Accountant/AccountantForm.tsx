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
import intl from 'react-intl-universal';

import {
  FormattedMessage as T,
  AccountsSelectList,
  FieldRequiredHint,
  CardFooterActions,
} from '@/components';
import { handleStringChange, inputIntent } from '@/utils';
import { ACCOUNT_TYPE } from '@/common/accountTypes';

import { useAccountantFormContext } from './AccountantFormProvider';

/**
 * Accountant form.
 */
export default function AccountantForm() {
  const history = useHistory();

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
                label={
                  <T
                    id={'make_account_code_required_when_create_a_new_accounts'}
                  />
                }
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
                  <T
                    id={
                      'should_account_code_be_unique_when_create_a_new_account'
                    }
                  />
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
              <Radio label={intl.get('cash')} value="cash" />
              <Radio label={intl.get('accrual')} value="accrual" />
            </RadioGroup>
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Deposit customer account ----------- */}
      <FastField name={'preferred_deposit_account'}>
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
                setFieldValue('preferred_deposit_account', id);
              }}
              selectedAccountId={value}
              defaultSelectText={<T id={'select_payment_account'} />}
              filterByTypes={[
                ACCOUNT_TYPE.CASH,
                ACCOUNT_TYPE.BANK,
                ACCOUNT_TYPE.OTHER_CURRENT_ASSET,
              ]}
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
                setFieldValue('withdrawal_account', id);
              }}
              selectedAccountId={value}
              defaultSelectText={<T id={'select_payment_account'} />}
              filterByTypes={[
                ACCOUNT_TYPE.CASH,
                ACCOUNT_TYPE.BANK,
                ACCOUNT_TYPE.OTHER_CURRENT_ASSET,
              ]}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Withdrawal customer account ----------- */}
      <FastField name={'preferred_advance_deposit'}>
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
                setFieldValue('preferred_advance_deposit', id);
              }}
              selectedAccountId={value}
              defaultSelectText={<T id={'select_payment_account'} />}
              // filterByParentTypes={[ACCOUNT_PARENT_TYPE.CURRENT_ASSET]}
            />
          </FormGroup>
        )}
      </FastField>

      <CardFooterActions>
        <Button intent={Intent.PRIMARY} loading={isSubmitting} type="submit">
          <T id={'save'} />
        </Button>
        <Button disabled={isSubmitting} onClick={handleCloseClick}>
          <T id={'close'} />
        </Button>
      </CardFooterActions>
    </Form>
  );
}
