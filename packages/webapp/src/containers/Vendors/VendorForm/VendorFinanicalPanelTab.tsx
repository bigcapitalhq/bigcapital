// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { FormGroup, ControlGroup, Position, Classes } from '@blueprintjs/core';
import { FastField, ErrorMessage, useFormikContext } from 'formik';
import { Features } from '@/constants';
import {
  FFormGroup,
  InputPrependText,
  CurrencySelectList,
  BranchSelect,
  BranchSelectButton,
  FeatureCan,
  Row,
  Col,
  FormattedMessage as T,
  FMoneyInputGroup,
  ExchangeRateInputGroup,
  FDateInput,
} from '@/components';
import { useIsVendorForeignCurrency, useSetPrimaryBranchToForm } from './utils';
import { useVendorFormContext } from './VendorFormProvider';
import { useCurrentOrganization } from '@/hooks/state';

/**
 * Vendor Finaniceal Panel Tab.
 */
export default function VendorFinanicalPanelTab() {
  const { currencies, branches } = useVendorFormContext();

  // Sets the primary branch to form.
  useSetPrimaryBranchToForm();

  return (
    <div className={'tab-panel--financial'}>
      <Row>
        <Col xs={6}>
          {/*------------ Currency  -----------*/}
          <FastField name={'currency_code'}>
            {({ form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'currency'} />}
                className={classNames(
                  'form-group--select-list',
                  'form-group--balance-currency',
                  Classes.FILL,
                )}
                inline={true}
              >
                <CurrencySelectList
                  currenciesList={currencies}
                  selectedCurrencyCode={value}
                  onCurrencySelected={(currency) => {
                    form.setFieldValue('currency_code', currency.currency_code);
                  }}
                />
              </FormGroup>
            )}
          </FastField>

          {/*------------ Opening balance -----------*/}
          <VendorOpeningBalanceField />
          <VendorOpeningBalanceExchangeRateField />

          {/*------------ Opening balance at  -----------*/}
          <VendorOpeningBalanceAtField />

          {/*------------ Opening branch  -----------*/}
          <FeatureCan feature={Features.Branches}>
            <FFormGroup
              label={<T id={'vendor.label.opening_branch'} />}
              name={'opening_balance_branch_id'}
              inline={true}
              className={classNames('form-group--select-list', Classes.FILL)}
            >
              <BranchSelect
                name={'opening_balance_branch_id'}
                branches={branches}
                input={BranchSelectButton}
                popoverProps={{ minimal: true }}
              />
            </FFormGroup>
          </FeatureCan>
        </Col>
      </Row>
    </div>
  );
}

function VendorOpeningBalanceField() {
  const { vendorId } = useVendorFormContext();
  const { values } = useFormikContext();

  // Cannot continue if the vendor id is defined.
  if (vendorId) return null;

  return (
    <FFormGroup
      name={'opening_balance'}
      label={<T id={'opening_balance'} />}
      inline={true}
    >
      <ControlGroup>
        <InputPrependText text={values.currency_code} />
        <FMoneyInputGroup
          name={'opening_balance'}
          inputGroupProps={{ fill: true }}
        />
      </ControlGroup>
    </FFormGroup>
  );
}

function VendorOpeningBalanceAtField() {
  const { vendorId } = useVendorFormContext();

  // Cannot continue if the vendor id is defined.
  if (vendorId) return null;

  return (
    <FFormGroup
      name={'opening_balance_at'}
      label={<T id={'opening_balance_at'} />}
      inline={true}
      helperText={<ErrorMessage name="opening_balance_at" />}
    >
      <FDateInput
        name={'opening_balance_at'}
        popoverProps={{ position: Position.BOTTOM, minimal: true }}
        disabled={vendorId}
        formatDate={(date) => date.toLocaleDateString()}
        parseDate={(str) => new Date(str)}
        fill={true}
      />
    </FFormGroup>
  );
}

function VendorOpeningBalanceExchangeRateField() {
  const { values } = useFormikContext();
  const { vendorId } = useVendorFormContext();
  const isForeignVendor = useIsVendorForeignCurrency();
  const currentOrganization = useCurrentOrganization();

  // Cannot continue if the current vendor does not have foreign currency.
  if (!isForeignVendor || vendorId) {
    return null;
  }

  return (
    <FFormGroup
      label={' '}
      name={'opening_balance_exchange_rate'}
      inline={true}
    >
      <ExchangeRateInputGroup
        fromCurrency={values.currency_code}
        toCurrency={currentOrganization.base_currency}
        name={'opening_balance_exchange_rate'}
      />
    </FFormGroup>
  );
}
