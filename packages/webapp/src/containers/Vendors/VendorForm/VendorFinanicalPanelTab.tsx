import { ControlGroup, Position } from '@blueprintjs/core';
import { ErrorMessage, useFormikContext } from 'formik';
import intl from 'react-intl-universal';
import {
  openingBalanceFieldShouldUpdate,
  useIsVendorForeignCurrency,
  useSetPrimaryBranchToForm,
} from './utils';
import type { VendorFormValues } from './utils';
import { useVendorFormContext } from './VendorFormProvider';
import {
  FFormGroup,
  InputPrependText,
  CurrencySelectList,
  BranchSelect,
  FeatureCan,
  Row,
  Col,
  FMoneyInputGroup,
  ExchangeRateInputGroup,
  FDateInput,
} from '@/components';
import { Features } from '@/constants';
import { useDateInputFormatter } from '@/hooks';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';

/**
 * Vendor Financial Panel Tab (legacy layout — kept for reference; not in the active form layout).
 */
export function VendorFinanicalPanelTab() {
  const { currencies, branches } = useVendorFormContext();

  // Sets the primary branch to form.
  useSetPrimaryBranchToForm();

  return (
    <div className={'tab-panel--financial'}>
      <Row>
        <Col xs={6}>
          {/*------------ Currency  -----------*/}
          <FFormGroup
            name={'currencyCode'}
            label={intl.get('currency')}
            fastField
            inline
          >
            <CurrencySelectList
              name="currencyCode"
              items={currencies}
              fastField
            />
          </FFormGroup>

          {/*------------ Opening balance -----------*/}
          <VendorOpeningBalanceField />
          <VendorOpeningBalanceExchangeRateField />

          {/*------------ Opening balance at  -----------*/}
          <VendorOpeningBalanceAtField />

          {/*------------ Opening branch  -----------*/}
          <FeatureCan feature={Features.Branches}>
            <FFormGroup
              label={intl.get('vendor.label.opening_branch')}
              name={'openingBalanceBranchId'}
              inline={true}
            >
              <BranchSelect
                name={'openingBalanceBranchId'}
                branches={branches}
                popoverProps={{ minimal: true }}
              />
            </FFormGroup>
          </FeatureCan>
        </Col>
      </Row>
    </div>
  );
}

/**
 * Vendor opening balance field.
 */
function VendorOpeningBalanceField() {
  const { vendorId } = useVendorFormContext();
  const { values } = useFormikContext<VendorFormValues>();

  // Cannot continue if the vendor id is defined.
  if (vendorId) return null;

  return (
    <FFormGroup
      name={'openingBalance'}
      label={intl.get('opening_balance')}
      // @ts-expect-error shouldUpdate is forwarded to FastField at runtime; FormGroupProps type doesn't expose it
      shouldUpdate={openingBalanceFieldShouldUpdate}
      shouldUpdateDeps={{ currencyCode: values.currencyCode }}
      inline
      fastField
    >
      <ControlGroup>
        <InputPrependText text={values.currencyCode} />
        <FMoneyInputGroup
          name={'openingBalance'}
          inputGroupProps={{ fill: true }}
          fastField
        />
      </ControlGroup>
    </FFormGroup>
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
      helperText={<ErrorMessage name="openingBalanceAt" />}
      inline
      fastField
    >
      <FDateInput
        name={'openingBalanceAt'}
        popoverProps={{ position: Position.BOTTOM, minimal: true }}
        disabled={Boolean(vendorId)}
        {...dateInputFormatter}
        fill
        fastField
      />
    </FFormGroup>
  );
}

/**
 * Vendor opening balance exchange rate field if the vendor has foreign currency.
 */
function VendorOpeningBalanceExchangeRateField() {
  const { values } = useFormikContext<VendorFormValues>();
  const { vendorId } = useVendorFormContext();
  const isForeignVendor = useIsVendorForeignCurrency();
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  // Cannot continue if the current vendor does not have foreign currency.
  if (!isForeignVendor || vendorId) {
    return null;
  }
  return (
    <FFormGroup
      label={' '}
      name={'openingBalanceExchangeRate'}
      inline
      fastField
    >
      <ExchangeRateInputGroup
        fromCurrency={values.currencyCode}
        toCurrency={baseCurrency ?? ''}
        name={'openingBalanceExchangeRate'}
      />
    </FFormGroup>
  );
}
