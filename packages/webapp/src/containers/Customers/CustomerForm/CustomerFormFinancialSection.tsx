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
  FInputGroup,
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
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { CustomerFormSectionTitle } from './CustomerFormSectionTitle';
import intl from 'react-intl-universal';

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
        label={intl.get('currency')}
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
      <CustomerWithholdingTaxRateField />

      <FeatureCan feature={Features.Branches}>
        <FFormGroup
          label={intl.get('customer.label.opening_branch')}
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

/**
 * Percentage the payer withholds from the tax-exclusive amount (e.g. NZ
 * schedular payments). When set, net-of-withholding payments book the
 * withheld portion automatically.
 */
function CustomerWithholdingTaxRateField() {
  return (
    <FFormGroup
      name={'withholding_tax_rate'}
      label={intl.get('customer.label.withholding_tax_rate')}
      inline
      fill
      helperText={<ErrorMessage name="withholding_tax_rate" />}
    >
      <ControlGroup>
        <FInputGroup
          name={'withholding_tax_rate'}
          type="number"
          min={0}
          max={100}
          fill={true}
        />
        <InputPrependText text={'%'} />
      </ControlGroup>
    </FFormGroup>
  );
}

function CustomerOpeningBalanceAtField() {
  const { customerId } = useCustomerFormContext();

  // Cannot continue if the customer id is defined.
  if (customerId) return null;

  return (
    <FFormGroup
      name={'opening_balance_at'}
      label={intl.get('opening_balance_at')}
      inline
      fill
      helperText={<ErrorMessage name="opening_balance_at" />}
    >
      <FDateInput
        name={'opening_balance_at'}
        popoverProps={{ position: Position.BOTTOM, minimal: true }}
        disabled={customerId}
        formatDate={(date) => date.toLocaleDateString()}
        parseDate={(str) => new Date(str)}
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
      label={intl.get('opening_balance')}
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
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  const isForeignJouranl = useIsCustomerForeignCurrency();

  // Can't continue if the customer is not foreign.
  if (!isForeignJouranl || customerId) {
    return null;
  }
  return (
    <ExchangeRateInputGroup
      fromCurrency={values.currency_code}
      toCurrency={baseCurrency}
      name={'opening_balance_exchange_rate'}
      onRecalcConfirm={() => {}}
      onCancel={() => {}}
      formGroupProps={{ label: ' ' }}
    />
  );
}
