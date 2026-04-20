// @ts-nocheck
import React from 'react';
import { Position, ControlGroup } from '@blueprintjs/core';
import { ErrorMessage, useFormikContext } from 'formik';
import { Features } from '@/constants';
import {
  FFormGroup,
  FormattedMessage as T,
  InputPrependText,
  CurrencySelectList,
  BranchSelect,
  FeatureCan,
  FMoneyInputGroup,
  ExchangeRateInputGroup,
  FDateInput,
  Icon,
  Box,
} from '@/components';
import { useCustomerFormContext } from './CustomerFormProvider';
import {
  openingBalanceFieldShouldUpdate,
  useIsCustomerForeignCurrency,
  useSetPrimaryBranchToForm,
} from './utils';
import { useCurrentOrganization } from '@/hooks/state';
import  { CustomerFormSectionTitle } from './CustomerFormSectionTitle';
import { momentFormatter } from '@/utils';

export function CustomerFormFinancialSection() {
  const { currencies, customerId, branches } = useCustomerFormContext();

  // Sets the primary branch to form.
  useSetPrimaryBranchToForm();

  return (
    <Box data-section-id="financial">
      <CustomerFormSectionTitle>
        <T id={'financial'} />
      </CustomerFormSectionTitle>
          
          <FFormGroup
            name={'currency_code'}
            label={<T id={'currency'} />}
            fastField
            inline
            fill
            >
            <CurrencySelectList
              name="currency_code"
              items={currencies}
              disabled={customerId}
              />
          </FFormGroup>

          <CustomerOpeningBalanceField />
          <CustomerOpeningBalanceExchangeRateField />
          <CustomerOpeningBalanceAtField />
          
          <FeatureCan feature={Features.Branches}>
            <FFormGroup
              label={<T id={'customer.label.opening_branch'} />}
              name={'opening_balance_branch_id'}
              inline
            >
              <BranchSelect
                name={'opening_balance_branch_id'}
                branches={branches}
                popoverProps={{ minimal: true }}
                fastField
              />
            </FFormGroup>
          </FeatureCan>
              </Box>
  );
}

function CustomerOpeningBalanceAtField() {
  const { customerId } = useCustomerFormContext();

  // Cannot continue if the customer id is defined.
  if (customerId) return null;

  return (
    <FFormGroup
      name={'opening_balance_at'}
      label={<T id={'opening_balance_at'} />}
      inline
      fill
      helperText={<ErrorMessage name="opening_balance_at" />}
    >
      <FDateInput
        name={'opening_balance_at'}
        popoverProps={{ position: Position.BOTTOM, minimal: true }}
        disabled={customerId}
        {...momentFormatter('MM/DD/YYYY')}
        inputProps={{
          leftIcon: <Icon icon={'date-range'} />,
        }}
        fill={true}
      />
    </FFormGroup>
  );
}

function CustomerOpeningBalanceField() {
  const { customerId } = useCustomerFormContext();
  const { values } = useFormikContext();

  // Cannot continue if the customer id is defined.
  if (customerId) return null;

  return (
    <FFormGroup
      label={<T id={'opening_balance'} />}
      name={'opening_balance'}
      inline
      shouldUpdate={openingBalanceFieldShouldUpdate}
      shouldUpdateDeps={{ currencyCode: values.currency_code }}
      fastField={true}
      fill
    >
      <ControlGroup>
        <InputPrependText text={values.currency_code as string} />
        <FMoneyInputGroup
          name={'opening_balance'}
          fastField
          inputGroupProps={{ fill: true }}
        />
      </ControlGroup>
    </FFormGroup>
  );
}

function CustomerOpeningBalanceExchangeRateField() {
  const { values } = useFormikContext();
  const { customerId } = useCustomerFormContext();
  const currentOrganization = useCurrentOrganization();

  const isForeignJouranl = useIsCustomerForeignCurrency();

  // Can't continue if the customer is not foreign.
  if (!isForeignJouranl || customerId) {
    return null;
  }
  return (
    
      <ExchangeRateInputGroup
        fromCurrency={values.currency_code}
        toCurrency={currentOrganization.base_currency}
        name={'opening_balance_exchange_rate'}
        onRecalcConfirm={() => {}}
        onCancel={() => {}}
        formGroupProps={{ label: ' ' }}
      />
  );
}
