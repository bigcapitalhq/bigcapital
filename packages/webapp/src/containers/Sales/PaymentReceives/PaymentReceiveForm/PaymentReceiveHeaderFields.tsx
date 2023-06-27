// @ts-nocheck
import React, { useMemo } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import {
  FormGroup,
  InputGroup,
  Position,
  Classes,
  ControlGroup,
  Button,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { toSafeInteger } from 'lodash';
import { FastField, Field, useFormikContext, ErrorMessage } from 'formik';

import {
  FeatureCan,
  CustomersSelect,
  FormattedMessage as T,
} from '@/components';
import { CLASSES } from '@/constants/classes';
import {
  safeSumBy,
  momentFormatter,
  transformDateValue,
  handleDateChange,
  inputIntent,
} from '@/utils';
import {
  FFormGroup,
  AccountsSelect,
  FieldRequiredHint,
  Icon,
  MoneyInputGroup,
  InputPrependText,
  CustomerDrawerLink,
  Hint,
  Money,
} from '@/components';
import { usePaymentReceiveFormContext } from './PaymentReceiveFormProvider';
import { ACCOUNT_TYPE } from '@/constants/accountTypes';
import { ProjectsSelect } from '@/containers/Projects/components';
import {
  PaymentReceiveExchangeRateInputField,
  PaymentReceiveProjectSelectButton,
} from './components';

import {
  amountPaymentEntries,
  fullAmountPaymentEntries,
  customersFieldShouldUpdate,
  accountsFieldShouldUpdate,
} from './utils';
import { Features } from '@/constants';
import { PaymentReceivePaymentNoField } from './PaymentReceivePaymentNoField';

/**
 * Payment receive header fields.
 */
export default function PaymentReceiveHeaderFields() {
  // Payment receive form context.
  const { accounts, projects } = usePaymentReceiveFormContext();

  // Formik form context.
  const {
    values: { entries },
    setFieldValue,
  } = useFormikContext();

  // Calculates the full-amount received.
  const totalDueAmount = useMemo(
    () => safeSumBy(entries, 'due_amount'),
    [entries],
  );
  // Handle receive full-amount link click.
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
      {/* ------------- Customer name ------------- */}
      <PaymentReceiveCustomerSelect />

      {/* ----------- Exchange rate ----------- */}
      <PaymentReceiveExchangeRateInputField
        name={'exchange_rate'}
        formGroupProps={{ label: ' ', inline: true }}
      />
      {/* ------------- Payment date ------------- */}
      <FastField name={'payment_date'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'payment_date'} />}
            inline={true}
            labelInfo={<FieldRequiredHint />}
            className={classNames('form-group--select-list', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="payment_date" />}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={transformDateValue(value)}
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
            setFieldValue,
            values: { currency_code },
          },
          field: { value, onChange },
          meta: { error, touched },
        }) => (
          <FormGroup
            label={<T id={'full_amount'} />}
            inline={true}
            className={('form-group--full-amount', CLASSES.FILL)}
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
              <Money amount={totalDueAmount} currency={currency_code} />)
            </Button>
          </FormGroup>
        )}
      </Field>

      {/* ------------ Payment receive no. ------------ */}
      <PaymentReceivePaymentNoField />

      {/* ------------ Deposit account ------------ */}
      <FFormGroup
        name={'deposit_account_id'}
        label={<T id={'deposit_to'} />}
        inline={true}
        labelInfo={<FieldRequiredHint />}
        items={accounts}
        shouldUpdate={accountsFieldShouldUpdate}
        fastField={true}
      >
        <AccountsSelect
          name={'deposit_account_id'}
          items={accounts}
          labelInfo={<FieldRequiredHint />}
          placeholder={<T id={'select_deposit_account'} />}
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

      {/* ------------ Reference No. ------------ */}
      <FastField name={'reference_no'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'reference'} />}
            inline={true}
            className={classNames('form-group--reference', CLASSES.FILL)}
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

      {/*------------ Project name -----------*/}
      <FeatureCan feature={Features.Projects}>
        <FFormGroup
          name={'project_id'}
          label={<T id={'payment_receive.project_name.label'} />}
          inline={true}
          className={classNames('form-group--select-list', Classes.FILL)}
        >
          <ProjectsSelect
            name={'project_id'}
            projects={projects}
            input={PaymentReceiveProjectSelectButton}
            popoverFill={true}
          />
        </FFormGroup>
      </FeatureCan>
    </div>
  );
}

const CustomerButtonLink = styled(CustomerDrawerLink)`
  font-size: 11px;
  margin-top: 6px;
`;

/**
 * Customer select field of payment receive form.
 * @returns {React.ReactNode}
 */
function PaymentReceiveCustomerSelect() {
  // Payment receive form context.
  const { customers, isNewMode } = usePaymentReceiveFormContext();

  // Formik form context.
  const { values, setFieldValue } = useFormikContext();

  return (
    <FFormGroup
      label={<T id={'customer_name'} />}
      inline={true}
      labelInfo={<FieldRequiredHint />}
      name={'customer_id'}
      fastField={true}
      shouldUpdate={customersFieldShouldUpdate}
      shouldUpdateDeps={{ items: customers }}
    >
      <CustomersSelect
        name={'customer_id'}
        items={customers}
        placeholder={<T id={'select_customer_account'} />}
        onItemChange={(customer) => {
          setFieldValue('customer_id', customer.id);
          setFieldValue('full_amount', '');
          setFieldValue('currency_code', customer?.currency_code);
        }}
        popoverFill={true}
        disabled={!isNewMode}
        allowCreate={true}
        fastField={true}
        shouldUpdate={customersFieldShouldUpdate}
        shouldUpdateDeps={{ items: customers }}
      />
      {values.customer_id && (
        <CustomerButtonLink customerId={values.customer_id}>
          <T id={'view_customer_details'} />
        </CustomerButtonLink>
      )}
    </FFormGroup>
  );
}
