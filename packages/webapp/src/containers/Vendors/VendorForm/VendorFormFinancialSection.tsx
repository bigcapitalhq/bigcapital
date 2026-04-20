// @ts-nocheck
import { FormGroup, Position, ControlGroup } from '@blueprintjs/core';
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
import { useVendorFormContext } from './VendorFormProvider';
import {
  openingBalanceFieldShouldUpdate,
  useIsVendorForeignCurrency,
  useSetPrimaryBranchToForm,
} from './utils';
import { useCurrentOrganization } from '@/hooks/state';
import { VendorFormSectionTitle } from './VendorFormSectionTitle';
import { momentFormatter } from '@/utils';

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
        name={'currency_code'}
        label={<T id={'currency'} />}
        fastField
        inline
        fill
      >
        <CurrencySelectList
          name="currency_code"
          items={currencies}
          disabled={vendorId}
          fastField
        />
      </FFormGroup>

      <VendorOpeningBalanceField />
      <VendorOpeningBalanceExchangeRateField />
      <VendorOpeningBalanceAtField />

      <FeatureCan feature={Features.Branches}>
        <FFormGroup
          label={<T id={'vendor.label.opening_branch'} />}
          name={'opening_balance_branch_id'}
          inline
          fill
        >
          <BranchSelect
            name={'opening_balance_branch_id'}
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
 * @returns {JSX.Element}
 */
function VendorOpeningBalanceAtField() {
  const { vendorId } = useVendorFormContext();

  // Cannot continue if the vendor id is defined.
  if (vendorId) return null;

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
        disabled={vendorId}
        {...momentFormatter('MM/DD/YYYY')}
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
  const { values } = useFormikContext();

  // Cannot continue if the vendor id is defined.
  if (vendorId) return null;

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
      <ControlGroup fill>
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

function VendorOpeningBalanceExchangeRateField() {
  const { values } = useFormikContext();
  const { vendorId } = useVendorFormContext();
  const currentOrganization = useCurrentOrganization();

  const isForeignVendor = useIsVendorForeignCurrency();

  // Can't continue if the vendor is not foreign.
  if (!isForeignVendor || vendorId) {
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
