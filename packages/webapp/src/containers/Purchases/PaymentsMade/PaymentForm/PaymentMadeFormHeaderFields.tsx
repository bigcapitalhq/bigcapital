// @ts-nocheck
import React, { useMemo } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { isEmpty, toSafeInteger } from 'lodash';
import {
  FormGroup,
  InputGroup,
  Position,
  Classes,
  ControlGroup,
  Button,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FastField, useFormikContext, ErrorMessage } from 'formik';
import {
  FInputGroup,
  FMoneyInputGroup,
  FormattedMessage as T,
  VendorsSelect,
} from '@/components';
import { CLASSES } from '@/constants/classes';

import {
  FFormGroup,
  AccountsSelect,
  FieldRequiredHint,
  InputPrependText,
  Money,
  Hint,
  Icon,
  VendorDrawerLink,
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
    values: { entries, currency_code },
    setFieldValue,
  } = useFormikContext();

  // Payment made form context.
  const { accounts } = usePaymentMadeFormContext();

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
    setFieldValue('amount', fullAmount);
  };

  // Handles the full-amount field blur.
  const onFullAmountBlur = (value) => {
    const newEntries = amountPaymentEntries(toSafeInteger(value), entries);
    setFieldValue('entries', newEntries);
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_FIELDS)}>
      {/* ------------ Vendor name ------------ */}
      <PaymentFormVendorSelect />

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
      <FFormGroup
        name={'amount'}
        label={<T id={'full_amount'} />}
        inline={true}
        labelInfo={<Hint />}
        fastField
      >
        <ControlGroup>
          <InputPrependText text={currency_code} />
          <FMoneyInputGroup
            fastField
            name={'amount'}
            onBlurValue={onFullAmountBlur}
          />
        </ControlGroup>

        {!isEmpty(entries) && (
          <Button
            onClick={handleReceiveFullAmountClick}
            className={'receive-full-amount'}
            small={true}
            minimal={true}
          >
            <T id={'receive_full_amount'} /> (
            <Money amount={payableFullAmount} currency={currency_code} />)
          </Button>
        )}
      </FFormGroup>

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
      <FFormGroup
        name={'reference'}
        label={<T id={'reference'} />}
        inline={true}
        fastField
      >
        <FInputGroup name={'reference'} minimal={true} fastField />
      </FFormGroup>
    </div>
  );
}

/**
 * Vendor select field of payment receive form.
 * @returns {React.ReactNode}
 */
function PaymentFormVendorSelect() {
  // Formik form context.
  const { values, setFieldValue } = useFormikContext();

  // Payment made form context.
  const { vendors, isNewMode, setPaymentVendorId } =
    usePaymentMadeFormContext();

  return (
    <FFormGroup
      name={'vendor_id'}
      label={<T id={'vendor_name'} />}
      labelInfo={<FieldRequiredHint />}
      inline={true}
      fastField={true}
      shouldUpdate={vendorsFieldShouldUpdate}
      shouldUpdateDeps={{ items: vendors }}
    >
      <VendorsSelect
        name={'vendor_id'}
        items={vendors}
        placeholder={<T id={'select_vender_account'} />}
        onItemChange={(contact) => {
          setFieldValue('vendor_id', contact.id);
          setFieldValue('currency_code', contact?.currency_code);
          setPaymentVendorId(contact.id);
        }}
        disabled={!isNewMode}
        allowCreate={true}
        fastField={true}
        shouldUpdate={vendorsFieldShouldUpdate}
        shouldUpdateDeps={{ items: vendors }}
      />
      {values.vendor_id && (
        <VendorButtonLink vendorId={values.vendor_id}>
          <T id={'view_vendor_details'} />
        </VendorButtonLink>
      )}
    </FFormGroup>
  );
}

export default compose(withCurrentOrganization())(PaymentMadeFormHeaderFields);

const VendorButtonLink = styled(VendorDrawerLink)`
  font-size: 11px;
  margin-top: 6px;
`;
