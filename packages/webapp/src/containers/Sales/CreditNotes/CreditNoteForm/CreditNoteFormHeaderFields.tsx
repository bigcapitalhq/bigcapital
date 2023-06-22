// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import classNames from 'classnames';
import styled from 'styled-components';
import {
  FormGroup,
  InputGroup,
  Position,
  ControlGroup,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FastField, ErrorMessage, useFormikContext } from 'formik';

import { CLASSES } from '@/constants/classes';
import {
  CustomerSelectField,
  FieldRequiredHint,
  InputPrependButton,
  Icon,
  FormattedMessage as T,
  CustomerDrawerLink,
  FFormGroup,
  FInputGroup,
  CustomersSelect,
} from '@/components';
import { customerNameFieldShouldUpdate } from './utils';

import { useCreditNoteFormContext } from './CreditNoteFormProvider';
import withSettings from '@/containers/Settings/withSettings';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { CreditNoteExchangeRateInputField } from './components';
import {
  momentFormatter,
  tansformDateValue,
  inputIntent,
  handleDateChange,
} from '@/utils';

/**
 * Credit note transaction number field.
 */
const CreditNoteTransactionNoField = R.compose(
  withDialogActions,
  withSettings(({ creditNoteSettings }) => ({
    creditAutoIncrement: creditNoteSettings?.autoIncrement,
    creditNextNumber: creditNoteSettings?.nextNumber,
    creditNumberPrefix: creditNoteSettings?.numberPrefix,
  })),
)(
  ({
    // #withDialogActions
    openDialog,

    // #withSettings
    creditAutoIncrement,
  }) => {
    const { values, setFieldValue } = useFormikContext();

    // Handle credit number changing.
    const handleCreditNumberChange = () => {
      openDialog('credit-number-form');
    };
    // Handle credit note no. field blur.
    const handleCreditNoBlur = (event) => {
      const newValue = event.target.value;

      // Show the confirmation dialog if the value has changed and auto-increment
      // mode is enabled.
      if (values.credit_note_no !== newValue && creditAutoIncrement) {
        openDialog('credit-number-form', {
          initialFormValues: {
            onceManualNumber: newValue,
            incrementMode: 'manual-transaction',
          },
        });
      }
      // Setting the credit note number to the form will be manually in case
      // auto-increment is disable.
      if (!creditAutoIncrement) {
        setFieldValue('credit_note_number', newValue);
        setFieldValue('credit_note_number_manually', newValue);
      }
    };

    return (
      <FFormGroup
        name={'credit_note_number'}
        label={<T id={'credit_note.label_credit_note'} />}
        labelInfo={<FieldRequiredHint />}
        inline={true}
      >
        <ControlGroup fill={true}>
          <FInputGroup
            name={'credit_note_number'}
            minimal={true}
            value={values.credit_note_number}
            asyncControl={true}
            onBlur={handleCreditNoBlur}
            onChange={() => {}}
          />
          <InputPrependButton
            buttonProps={{
              onClick: handleCreditNumberChange,
              icon: <Icon icon={'settings-18'} />,
            }}
            tooltip={true}
            tooltipProps={{
              content: (
                <T id={'setting_your_auto_generated_credit_note_number'} />
              ),
              position: Position.BOTTOM_LEFT,
            }}
          />
        </ControlGroup>
      </FFormGroup>
    );
  },
);

/**
 * Credit note form header fields.
 */
export default function CreditNoteFormHeaderFields({}) {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_FIELDS)}>
      {/* ----------- Customer name ----------- */}
      <CreditNoteCustomersSelect />

      {/* ----------- Exchange rate ----------- */}
      <CreditNoteExchangeRateInputField
        name={'exchange_rate'}
        formGroupProps={{ label: ' ', inline: true }}
      />
      {/* ----------- Credit note date ----------- */}
      <FastField name={'credit_note_date'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'credit_note.label_credit_note_date'} />}
            inline={true}
            labelInfo={<FieldRequiredHint />}
            className={classNames('form-group--credit_note_date', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="credit_note_date" />}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={tansformDateValue(value)}
              onChange={handleDateChange((formattedDate) => {
                form.setFieldValue('credit_note_date', formattedDate);
              })}
              popoverProps={{ position: Position.BOTTOM_LEFT, minimal: true }}
              inputProps={{
                leftIcon: <Icon icon={'date-range'} />,
              }}
            />
          </FormGroup>
        )}
      </FastField>
      {/* ----------- Credit note # ----------- */}
      <CreditNoteTransactionNoField />

      {/* ----------- Reference ----------- */}
      <FastField name={'reference_no'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'reference_no'} />}
            inline={true}
            className={classNames('form-group--reference', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="reference_no" />}
          >
            <InputGroup minimal={true} {...field} />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}

/**
 * Customer select field of credit note form.
 * @returns {React.ReactNode}
 */
function CreditNoteCustomersSelect() {
  // Credit note form context.
  const { customers } = useCreditNoteFormContext();
  const { setFieldValue, values } = useFormikContext();

  return (
    <FFormGroup
      name={'customer_id'}
      label={<T id={'customer_name'} />}
      labelInfo={<FieldRequiredHint />}
      inline={true}
      fastField={true}
      shouldUpdate={customerNameFieldShouldUpdate}
      shouldUpdateDeps={{ items: customers }}
    >
      <CustomersSelect
        name={'customer_id'}
        items={customers}
        placeholder={<T id={'select_customer_account'} />}
        onItemChange={(customer) => {
          setFieldValue('customer_id', customer.id);
          setFieldValue('currency_code', customer?.currency_code);
        }}
        popoverFill={true}
        allowCreate={true}
        fastField={true}
        shouldUpdate={customerNameFieldShouldUpdate}
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

const CustomerButtonLink = styled(CustomerDrawerLink)`
  font-size: 11px;
  margin-top: 6px;
`;
