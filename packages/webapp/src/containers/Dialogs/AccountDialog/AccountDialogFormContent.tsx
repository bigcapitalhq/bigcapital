import { Button, Classes, Intent } from '@blueprintjs/core';
import { Form, useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { useAccountDialogContext } from './AccountDialogProvider';
import { parentAccountShouldUpdate } from './utils';
import type { AccountFormValues } from './types';
import {
  If,
  FieldRequiredHint,
  Hint,
  AccountsSelect,
  AccountsTypesSelect,
  CurrencySelect,
  FormattedMessage as T,
  FFormGroup,
  FInputGroup,
  FCheckbox,
  FTextArea,
} from '@/components';
import { FOREIGN_CURRENCY_ACCOUNTS } from '@/constants/accountTypes';
import { useAutofocus } from '@/hooks';
import { useCurrentOrganization } from '@/hooks/query';
import {
  isBankIdentificationAccountType,
  isBankIdentificationCountry,
  normalizeLocation,
} from './bankIdentification';

interface AccountFormDialogFieldsProps {
  onClose: () => void;
  action?: string;
}

export function AccountDialogFormContent({
  // #ownProps
  onClose,
  action,
}: AccountFormDialogFieldsProps): React.ReactElement {
  const { values, isSubmitting, setFieldValue } =
    useFormikContext<AccountFormValues>();
  const accountNameFieldRef = useAutofocus<HTMLInputElement>();
  const { fieldsDisabled, currencies, accounts, accountsTypes } =
    useAccountDialogContext();

  // Organizations in Brazil and Argentina record local banking identifiers on
  // their bank accounts. The fields differ by country, so both the country and
  // the selected account type decide what is shown.
  const { data: currentOrganization } = useCurrentOrganization();
  const organizationLocation = normalizeLocation(
    currentOrganization?.metadata?.location,
  );
  const showBankIdentification =
    isBankIdentificationCountry(organizationLocation) &&
    isBankIdentificationAccountType(values.accountType);

  return (
    <Form>
      <div className={Classes.DIALOG_BODY}>
        <FFormGroup
          inline={true}
          label={intl.get('account_type')}
          labelInfo={<FieldRequiredHint />}
          name={'accountType'}
          fastField={true}
        >
          <AccountsTypesSelect
            name={'accountType'}
            items={accountsTypes as []}
            onItemSelect={(accountType: { key: string }) => {
              setFieldValue('accountType', accountType.key);
              setFieldValue('currencyCode', '');
            }}
            disabled={fieldsDisabled.accountType}
            popoverProps={{ minimal: true }}
            fastField={true}
            fill={true}
          />
        </FFormGroup>

        <FFormGroup
          name={'name'}
          label={intl.get('account_name')}
          labelInfo={<FieldRequiredHint />}
          inline={true}
          fastField={true}
        >
          <FInputGroup
            inputRef={(ref: HTMLInputElement | null) => {
              accountNameFieldRef.current = ref;
            }}
            name={'name'}
            data-testId={'account-name-input'}
            fastField={true}
          />
        </FFormGroup>

        <FFormGroup
          label={intl.get('account_code')}
          name={'code'}
          labelInfo={<Hint content={<T id="account_code_hint" />} />}
          inline={true}
          fastField={true}
        >
          <FInputGroup
            name={'code'}
            data-testId={'account-code-input'}
            fastField={true}
          />
        </FFormGroup>

        <FFormGroup
          label={' '}
          name={'subaccount'}
          inline={true}
          fastField={true}
        >
          <FCheckbox
            inline={true}
            label={intl.get('sub_account')}
            name={'subaccount'}
            fastField={true}
          />
        </FFormGroup>

        {values.subaccount && (
          <FFormGroup
            name={'parentAccountId'}
            shouldUpdate={parentAccountShouldUpdate}
            label={intl.get('parent_account')}
            inline={true}
            fastField={true}
          >
            <AccountsSelect
              name={'parentAccountId'}
              items={accounts as []}
              shouldUpdate={parentAccountShouldUpdate}
              placeholder={<T id={'select_parent_account'} />}
              filterByTypes={[values.accountType]}
              buttonProps={{ disabled: !values.subaccount }}
              fastField={true}
              fill={true}
              allowCreate={true}
            />
          </FFormGroup>
        )}

        <If condition={FOREIGN_CURRENCY_ACCOUNTS.includes(values.accountType)}>
          {/*------------ Currency  ----------- */}
          <FFormGroup
            label={intl.get('currency')}
            name={'currencyCode'}
            inline
            fastField
          >
            <CurrencySelect
              name={'currencyCode'}
              currencies={currencies as []}
              popoverProps={{ minimal: true }}
              fastField
              fill
            />
          </FFormGroup>
        </If>

        {/*------------ Bank identification (Brazil) ----------- */}
        <If condition={showBankIdentification && organizationLocation === 'BR'}>
          <FFormGroup
            label={intl.get('accounts.bank_code')}
            name={'bankCode'}
            labelInfo={<FieldRequiredHint />}
            inline
            fastField
          >
            <FInputGroup name={'bankCode'} maxLength={3} fastField />
          </FFormGroup>

          <FFormGroup
            label={intl.get('accounts.agency_number')}
            name={'agencyNumber'}
            labelInfo={<FieldRequiredHint />}
            inline
            fastField
          >
            <FInputGroup name={'agencyNumber'} maxLength={5} fastField />
          </FFormGroup>

          <FFormGroup
            label={intl.get('accounts.account_number')}
            name={'accountNumber'}
            labelInfo={<FieldRequiredHint />}
            inline
            fastField
          >
            <FInputGroup
              name={'accountNumber'}
              placeholder={'12345678-9'}
              fastField
            />
          </FFormGroup>
        </If>

        {/*------------ Bank identification (Argentina) ----------- */}
        <If condition={showBankIdentification && organizationLocation === 'AR'}>
          <FFormGroup
            label={intl.get('accounts.cbu')}
            name={'cbu'}
            labelInfo={<FieldRequiredHint />}
            inline
            fastField
          >
            <FInputGroup name={'cbu'} maxLength={22} fastField />
          </FFormGroup>
        </If>

        <FFormGroup
          label={intl.get('description')}
          name={'description'}
          inline
          fastField
        >
          <FTextArea
            name={'description'}
            growVertically={true}
            fill
            fastField
          />
        </FFormGroup>
      </div>

      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button
            disabled={isSubmitting}
            onClick={onClose}
            style={{ minWidth: '75px' }}
          >
            <T id={'close'} />
          </Button>

          <Button
            intent={Intent.PRIMARY}
            loading={isSubmitting}
            style={{ minWidth: '95px' }}
            type="submit"
          >
            {action === 'edit' ? <T id={'edit'} /> : <T id={'submit'} />}
          </Button>
        </div>
      </div>
    </Form>
  );
}
