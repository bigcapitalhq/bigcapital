// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { FormGroup, Position, Classes, ControlGroup } from '@blueprintjs/core';
import { FastField, ErrorMessage, useFormikContext } from 'formik';
import { Features } from '@/constants';
import {
  FFormGroup,
  FormattedMessage as T,
  InputPrependText,
  CurrencySelectList,
  BranchSelect,
  BranchSelectButton,
  FeatureCan,
  Row,
  Col,
  FMoneyInputGroup,
  ExchangeRateInputGroup,
  FDateInput,
} from '@/components';
import { useCustomerFormContext } from './CustomerFormProvider';
import {
  openingBalanceFieldShouldUpdate,
  useIsCustomerForeignCurrency,
  useSetPrimaryBranchToForm,
} from './utils';
import { useCurrentOrganization } from '@/hooks/state';

/**
 * Customer financial panel.
 */
export default function CustomerFinancialPanel() {
  const { currencies, customerId, branches } = useCustomerFormContext();

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
                  disabled={customerId}
                />
              </FormGroup>
            )}
          </FastField>

          {/*------------ Opening balance  -----------*/}
          <CustomerOpeningBalanceField />

          {/*------ Opening Balance Exchange Rate  -----*/}
          <CustomerOpeningBalanceExchangeRateField />

          {/*------------ Opening balance at -----------*/}
          <CustomerOpeningBalanceAtField />

          {/*------------ Opening branch  -----------*/}
          <FeatureCan feature={Features.Branches}>
            <FFormGroup
              label={<T id={'customer.label.opening_branch'} />}
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

/**
 * Customer opening balance at date field.
 * @returns {JSX.Element}
 */
function CustomerOpeningBalanceAtField() {
  const { customerId } = useCustomerFormContext();

  // Cannot continue if the customer id is defined.
  if (customerId) return null;

  return (
    <FormGroup
      name={'opening_balance_at'}
      label={<T id={'opening_balance_at'} />}
      inline={true}
      helperText={<ErrorMessage name="opening_balance_at" />}
    >
      <FDateInput
        name={'opening_balance_at'}
        popoverProps={{ position: Position.BOTTOM, minimal: true }}
        disabled={customerId}
        formatDate={(date) => date.toLocaleDateString()}
        parseDate={(str) => new Date(str)}
        fill={true}
      />
    </FormGroup>
  );
}

/**
 * Customer opening balance field.
 * @returns {JSX.Element}
 */
function CustomerOpeningBalanceField() {
  const { customerId } = useCustomerFormContext();
  const { values } = useFormikContext();

  // Cannot continue if the customer id is defined.
  if (customerId) return null;

  return (
    <FFormGroup
      label={<T id={'opening_balance'} />}
      name={'opening_balance'}
      inline={true}
      shouldUpdate={openingBalanceFieldShouldUpdate}
      shouldUpdateDeps={{ currencyCode: values.currency_code }}
      fastField={true}
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

/**
 * Customer opening balance exchange rate field if the customer has foreign
 * currency.
 * @returns {JSX.Element}
 */
function CustomerOpeningBalanceExchangeRateField() {
  const { values } = useFormikContext();
  const { customerId } = useCustomerFormContext();
  const currentOrganization = useCurrentOrganization();

  const isForeignJournal = useIsCustomerForeignCurrency();

  // Can't continue if the customer is not foreign.
  if (!isForeignJournal || customerId) {
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
