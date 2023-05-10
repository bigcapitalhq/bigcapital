// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Form, useFormikContext } from 'formik';
import styled from 'styled-components';
import { FormGroup, Radio, Button, Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';

import {
  FormattedMessage as T,
  AccountsSelect,
  FieldRequiredHint,
  CardFooterActions,
  FFormGroup,
  FCheckbox,
  FRadioGroup,
} from '@/components';
import { ACCOUNT_PARENT_TYPE, ACCOUNT_TYPE } from '@/constants/accountTypes';
import { useAccountantFormContext } from './AccountantFormProvider';

/**
 * Accountant form.
 */
export default function AccountantForm() {
  const history = useHistory();
  const { accounts } = useAccountantFormContext();
  const { isSubmitting } = useFormikContext();

  const handleCloseClick = () => {
    history.go(-1);
  };

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
        {/*------------ Account Code (required) -----------*/}
        <FFormGroup inline={true} name={'accounts.accountCodeRequired'}>
          <FCheckbox
            inline={true}
            label={
              <T id={'make_account_code_required_when_create_a_new_accounts'} />
            }
            name={'accounts.accountCodeRequired'}
          />
        </FFormGroup>

        {/*------------ Account Code (unique) -----------*/}
        <FFormGroup
          name={'accounts.accountCodeUnique'}
          type={'checkbox'}
          inline={true}
        >
          <FCheckbox
            inline={true}
            label={
              <T
                id={'should_account_code_be_unique_when_create_a_new_account'}
              />
            }
            name={'accounts.accountCodeUnique'}
          />
        </FFormGroup>
      </FormGroup>

      {/* ----------- Accounting Basis ----------- */}
      <FormGroup
        name={'organization.accountingBasis'}
        labelInfo={<FieldRequiredHint />}
        label={
          <strong>
            <T id={'accounting_basis_'} />
          </strong>
        }
      >
        <FRadioGroup name={'organization.accountingBasis'} inline={true}>
          <Radio label={intl.get('cash')} value="cash" />
          <Radio label={intl.get('accrual')} value="accrual" />
        </FRadioGroup>
      </FormGroup>

      {/* ----------- Deposit Customer Account ----------- */}
      <AccountantFormGroup
        name={'paymentReceives.preferredDepositAccount'}
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
        fastField={true}
      >
        <AccountsSelect
          name={'paymentReceives.preferredDepositAccount'}
          items={accounts}
          placeholder={<T id={'select_payment_account'} />}
          filterByTypes={[
            ACCOUNT_TYPE.CASH,
            ACCOUNT_TYPE.BANK,
            ACCOUNT_TYPE.OTHER_CURRENT_ASSET,
          ]}
          fastField={true}
        />
      </AccountantFormGroup>

      {/* ----------- Withdrawal Vendor Account ----------- */}
      <AccountantFormGroup
        name={'billPayments.withdrawalAccount'}
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
        fastField={true}
      >
        <AccountsSelect
          name={'billPayments.withdrawalAccount'}
          items={accounts}
          placeholder={<T id={'select_payment_account'} />}
          filterByTypes={[
            ACCOUNT_TYPE.CASH,
            ACCOUNT_TYPE.BANK,
            ACCOUNT_TYPE.OTHER_CURRENT_ASSET,
          ]}
          fastField={true}
        />
      </AccountantFormGroup>

      {/* ----------- Withdrawal Customer Account ----------- */}
      <AccountantFormGroup
        name={'paymentReceives.preferredAdvanceDeposit'}
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
        fastField={true}
      >
        <AccountsSelect
          name={'paymentReceives.preferredAdvanceDeposit'}
          items={accounts}
          placeholder={<T id={'select_payment_account'} />}
          filterByParentTypes={[ACCOUNT_PARENT_TYPE.CURRENT_ASSET]}
          fastField={true}
        />
      </AccountantFormGroup>

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

const AccountantFormGroup = styled(FFormGroup)`
  width: 450px;
`;
