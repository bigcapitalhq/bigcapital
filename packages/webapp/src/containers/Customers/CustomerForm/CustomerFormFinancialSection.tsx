import { Position, ControlGroup } from '@blueprintjs/core';
import { ErrorMessage, useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { useCustomerFormContext } from './CustomerFormProvider';
import { CustomerFormSectionTitle } from './CustomerFormSectionTitle';
import {
  openingBalanceFieldShouldUpdate,
  useIsCustomerForeignCurrency,
  useSetPrimaryBranchToForm,
} from './utils';
import type { CustomerFormValues } from './utils';
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
import { Features } from '@/constants';
import { useDateInputFormatter } from '@/hooks';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';

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
        name={'currencyCode'}
        label={intl.get('currency')}
        fastField
        inline
      >
        <CurrencySelectList
          name="currencyCode"
          items={currencies}
          disabled={Boolean(customerId)}
        />
      </FFormGroup>

      <CustomerOpeningBalanceField />
      <CustomerOpeningBalanceExchangeRateField />
      <CustomerOpeningBalanceAtField />

      <FeatureCan feature={Features.Branches}>
        <FFormGroup
          label={intl.get('customer.label.opening_branch')}
          name={'openingBalanceBranchId'}
          inline
        >
          <BranchSelect
            name={'openingBalanceBranchId'}
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
  const dateInputFormatter = useDateInputFormatter();

  // Cannot continue if the customer id is defined.
  if (customerId) return null;

  return (
    <FFormGroup
      name={'openingBalanceAt'}
      label={intl.get('opening_balance_at')}
      inline
      helperText={<ErrorMessage name="openingBalanceAt" />}
    >
      <FDateInput
        name={'openingBalanceAt'}
        popoverProps={{ position: Position.BOTTOM, minimal: true }}
        disabled={Boolean(customerId)}
        {...dateInputFormatter}
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
  const { values } = useFormikContext<CustomerFormValues>();

  // Cannot continue if the customer id is defined.
  if (customerId) return null;

  return (
    <FFormGroup
      label={intl.get('opening_balance')}
      name={'openingBalance'}
      inline
      // @ts-expect-error shouldUpdate is forwarded to FastField at runtime; FormGroupProps type doesn't expose it
      shouldUpdate={openingBalanceFieldShouldUpdate}
      shouldUpdateDeps={{ currencyCode: values.currencyCode }}
      fastField={true}
    >
      <ControlGroup>
        <InputPrependText text={values.currencyCode} />
        <FMoneyInputGroup
          name={'openingBalance'}
          fastField
          inputGroupProps={{ fill: true }}
        />
      </ControlGroup>
    </FFormGroup>
  );
}

function CustomerOpeningBalanceExchangeRateField() {
  const { values } = useFormikContext<CustomerFormValues>();
  const { customerId } = useCustomerFormContext();
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  const isForeignJournal = useIsCustomerForeignCurrency();

  // Can't continue if the customer is not foreign.
  if (!isForeignJournal || customerId) {
    return null;
  }
  return (
    <ExchangeRateInputGroup
      fromCurrency={values.currencyCode}
      toCurrency={baseCurrency ?? ''}
      name={'openingBalanceExchangeRate'}
      onRecalcConfirm={() => {}}
      onCancel={() => {}}
      formGroupProps={{ label: ' ' }}
    />
  );
}
