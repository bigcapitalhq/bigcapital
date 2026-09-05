import { Position, ControlGroup } from '@blueprintjs/core';
import { ErrorMessage, useFormikContext } from 'formik';
import intl from 'react-intl-universal';
import {
  openingBalanceFieldShouldUpdate,
  useIsVendorForeignCurrency,
  useSetPrimaryBranchToForm,
} from './utils';
import { useVendorFormContext } from './VendorFormProvider';
import { VendorFormSectionTitle } from './VendorFormSectionTitle';
import type { VendorFormValues } from './utils';
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

export function VendorFormFinancialSection() {
  const { currencies, vendorId, branches } = useVendorFormContext();

  // Sets the primary branch to form.
  useSetPrimaryBranchToForm();

  return (
    <Box data-section-id="financial">
      <VendorFormSectionTitle>
        <T id={'financial_details'} />
      </VendorFormSectionTitle>

      <FFormGroup
        name={'currencyCode'}
        label={intl.get('currency')}
        fastField
        inline
      >
        <CurrencySelectList
          name="currencyCode"
          items={currencies}
          disabled={Boolean(vendorId)}
          fastField
        />
      </FFormGroup>

      <VendorOpeningBalanceField />
      <VendorOpeningBalanceExchangeRateField />
      <VendorOpeningBalanceAtField />

      <FeatureCan feature={Features.Branches}>
        <FFormGroup
          label={intl.get('vendor.label.opening_branch')}
          name={'openingBalanceBranchId'}
          inline
        >
          <BranchSelect
            name={'openingBalanceBranchId'}
            branches={branches}
            popoverProps={{ minimal: true }}
          />
        </FFormGroup>
      </FeatureCan>
    </Box>
  );
}

/**
 * Vendor opening balance at date field.
 */
function VendorOpeningBalanceAtField() {
  const { vendorId } = useVendorFormContext();
  const dateInputFormatter = useDateInputFormatter();

  // Cannot continue if the vendor id is defined.
  if (vendorId) return null;

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
        disabled={Boolean(vendorId)}
        {...dateInputFormatter}
        inputProps={{
          leftIcon: <Icon icon={'date-range'} />,
        }}
        fill={true}
      />
    </FFormGroup>
  );
}

function VendorOpeningBalanceField() {
  const { vendorId } = useVendorFormContext();
  const { values } = useFormikContext<VendorFormValues>();

  // Cannot continue if the vendor id is defined.
  if (vendorId) return null;

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
      <ControlGroup fill>
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

function VendorOpeningBalanceExchangeRateField() {
  const { values } = useFormikContext<VendorFormValues>();
  const { vendorId } = useVendorFormContext();
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  const isForeignVendor = useIsVendorForeignCurrency();

  // Can't continue if the vendor is not foreign.
  if (!isForeignVendor || vendorId) {
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
