// @ts-nocheck
import React, { useMemo } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import {
  FormGroup,
  InputGroup,
  Position,
  Classes,
  ControlGroup,
  Button,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FastField, Field, useFormikContext, ErrorMessage } from 'formik';
import { FormattedMessage as T } from '@/components';
import { toSafeInteger } from 'lodash';
import { CLASSES } from '@/constants/classes';

import {
  FFormGroup,
  AccountsSelect,
  VendorSelectField,
  FieldRequiredHint,
  InputPrependText,
  Money,
  Hint,
  Icon,
  VendorDrawerLink,
  MoneyInputGroup,
} from '@/components';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';
import { usePaymentMadeFormContext } from './PaymentMadeFormProvider';
import { ACCOUNT_TYPE } from '@/constants/accountTypes';
import { PaymentMadeExchangeRateInputField } from './components';
import {
  momentFormatter,
  tansformDateValue,
  handleDateChange,
  inputIntent,
  compose,
  safeSumBy,
  fullAmountPaymentEntries,
  amountPaymentEntries,
} from '@/utils';
import { accountsFieldShouldUpdate, vendorsFieldShouldUpdate } from './utils';

/**
 * Payment made form header fields.
 */
function PaymentMadeFormHeaderFields({ organization: { base_currency } }) {
  // Formik form context.
  const {
    values: { entries },
    setFieldValue,
  } = useFormikContext();

  // Payment made form context.
  const { vendors, accounts, isNewMode, setPaymentVendorId } =
    usePaymentMadeFormContext();

  // Sumation of payable full-amount.
  const payableFullAmount = useMemo(
    () => safeSumBy(entries, 'due_amount'),
    [entries],
  );

  // Handle receive full-amount click.
  const handleReceiveFullAmountClick = () => {
    const newEntries = fullAmountPaymentEntries(entries);
    const fullAmount = safeSumBy(newEntries, 'payment_amount');

    setFieldValue('entries', newEntries);
    setFieldValue('full_amount', fullAmount);
  };

  // Handles the full-amount field blur.
  const onFullAmountBlur = (value) => {
    const newEntries = amountPaymentEntries(toSafeInteger(value), entries);
    setFieldValue('entries', newEntries);
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_FIELDS)}>
      {/* ------------ Vendor name ------------ */}
      <FastField
        name={'vendor_id'}
        vendors={vendors}
        shouldUpdate={vendorsFieldShouldUpdate}
      >
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FFormGroup
            name={'vendor_id'}
            label={<T id={'vendor_name'} />}
            inline={true}
            className={classNames('form-group--select-list', Classes.FILL)}
            labelInfo={<FieldRequiredHint />}
          >
            <VendorSelectField
              contacts={vendors}
              selectedContactId={value}
              defaultSelectText={<T id={'select_vender_account'} />}
              onContactSelected={(contact) => {
                form.setFieldValue('vendor_id', contact.id);
                form.setFieldValue('currency_code', contact?.currency_code);
                setPaymentVendorId(contact.id);
              }}
              disabled={!isNewMode}
              popoverFill={true}
              allowCreate={true}
            />

            {value && (
              <VendorButtonLink vendorId={value}>
                <T id={'view_vendor_details'} />
              </VendorButtonLink>
            )}
          </FFormGroup>
        )}
      </FastField>

      {/* ----------- Exchange rate ----------- */}
      <PaymentMadeExchangeRateInputField
        name={'exchange_rate'}
        formGroupProps={{ label: ' ', inline: true }}
      />

      {/* ------------ Payment date ------------ */}
      <FastField name={'payment_date'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'payment_date'} />}
            inline={true}
            labelInfo={<FieldRequiredHint />}
            className={classNames('form-group--select-list', Classes.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="payment_date" />}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={tansformDateValue(value)}
              onChange={handleDateChange((formattedDate) => {
                form.setFieldValue('payment_date', formattedDate);
              })}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              inputProps={{
                leftIcon: <Icon icon={'date-range'} />,
              }}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ------------ Full amount ------------ */}
      <Field name={'full_amount'}>
        {({
          form: {
            values: { currency_code },
          },
          field: { value },
          meta: { error, touched },
        }) => (
          <FormGroup
            label={<T id={'full_amount'} />}
            inline={true}
            className={('form-group--full-amount', Classes.FILL)}
            intent={inputIntent({ error, touched })}
            labelInfo={<Hint />}
            helperText={<ErrorMessage name="full_amount" />}
          >
            <ControlGroup>
              <InputPrependText text={currency_code} />
              <MoneyInputGroup
                value={value}
                onChange={(value) => {
                  setFieldValue('full_amount', value);
                }}
                onBlurValue={onFullAmountBlur}
              />
            </ControlGroup>

            <Button
              onClick={handleReceiveFullAmountClick}
              className={'receive-full-amount'}
              small={true}
              minimal={true}
            >
              <T id={'receive_full_amount'} /> (
              <Money amount={payableFullAmount} currency={currency_code} />)
            </Button>
          </FormGroup>
        )}
      </Field>

      {/* ------------ Payment number ------------ */}
      <FastField name={'payment_number'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'payment_no'} />}
            inline={true}
            className={('form-group--payment_number', Classes.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="payment_number" />}
          >
            <InputGroup
              intent={inputIntent({ error, touched })}
              minimal={true}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ------------ Payment account ------------ */}
      <FFormGroup
        name={'payment_account_id'}
        label={<T id={'payment_account'} />}
        labelInfo={<FieldRequiredHint />}
        items={accounts}
        shouldUpdate={accountsFieldShouldUpdate}
        inline={true}
        fastField={true}
      >
        <AccountsSelect
          name={'payment_account_id'}
          items={accounts}
          placeholder={<T id={'select_payment_account'} />}
          labelInfo={<FieldRequiredHint />}
          filterByTypes={[
            ACCOUNT_TYPE.CASH,
            ACCOUNT_TYPE.BANK,
            ACCOUNT_TYPE.OTHER_CURRENT_ASSET,
          ]}
          shouldUpdate={accountsFieldShouldUpdate}
          fastField={true}
          fill={true}
        />
      </FFormGroup>

      {/* ------------ Reference ------------ */}
      <FastField name={'reference'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'reference'} />}
            inline={true}
            className={classNames('form-group--reference', Classes.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="reference" />}
          >
            <InputGroup
              intent={inputIntent({ error, touched })}
              minimal={true}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}

export default compose(withCurrentOrganization())(PaymentMadeFormHeaderFields);

const VendorButtonLink = styled(VendorDrawerLink)`
  font-size: 11px;
  margin-top: 6px;
`;
