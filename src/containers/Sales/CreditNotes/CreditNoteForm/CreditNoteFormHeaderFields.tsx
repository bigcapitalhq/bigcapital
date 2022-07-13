import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import {
  FormGroup,
  InputGroup,
  Position,
  ControlGroup,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FastField, Field, ErrorMessage } from 'formik';
import { CLASSES } from '@/constants/classes';
import {
  CustomerSelectField,
  FieldRequiredHint,
  InputPrependButton,
  Icon,
  FormattedMessage as T,
  CustomerDrawerLink,
} from '@/components';
import {
  customerNameFieldShouldUpdate,
  useObserveCreditNoSettings,
} from './utils';

import { useCreditNoteFormContext } from './CreditNoteFormProvider';
import withSettings from '@/containers/Settings/withSettings';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { CreditNoteExchangeRateInputField } from './components';
import {
  momentFormatter,
  compose,
  tansformDateValue,
  inputIntent,
  handleDateChange,
} from '@/utils';

/**
 * Credit note form header fields.
 */
function CreditNoteFormHeaderFields({
  // #withDialogActions
  openDialog,

  // #withSettings
  creditAutoIncrement,
  creditNumberPrefix,
  creditNextNumber,
}) {
  // Credit note form context.
  const { customers } = useCreditNoteFormContext();

  // Handle credit number changing.
  const handleCreditNumberChange = () => {
    openDialog('credit-number-form');
  };

  // Handle credit no. field blur.
  const handleCreditNoBlur = (form, field) => (event) => {
    const newValue = event.target.value;

    if (field.value !== newValue && creditAutoIncrement) {
      openDialog('credit-number-form', {
        initialFormValues: {
          manualTransactionNo: newValue,
          incrementMode: 'manual-transaction',
        },
      });
    }
  };

  // Syncs credit number settings with form.
  useObserveCreditNoSettings(creditNumberPrefix, creditNextNumber);

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_FIELDS)}>
      {/* ----------- Customer name ----------- */}
      <FastField
        name={'customer_id'}
        customers={customers}
        shouldUpdate={customerNameFieldShouldUpdate}
      >
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'customer_name'} />}
            inline={true}
            className={classNames(
              'form-group--customer-name',
              'form-group--select-list',
              CLASSES.FILL,
            )}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'customer_id'} />}
          >
            <CustomerSelectField
              contacts={customers}
              selectedContactId={value}
              defaultSelectText={<T id={'select_customer_account'} />}
              onContactSelected={(customer) => {
                form.setFieldValue('customer_id', customer.id);
                form.setFieldValue('currency_code', customer?.currency_code);
              }}
              popoverFill={true}
              allowCreate={true}
            />
            {value && (
              <CustomerButtonLink customerId={value}>
                <T id={'view_customer_details'} />
              </CustomerButtonLink>
            )}
          </FormGroup>
        )}
      </FastField>

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
      <Field name={'credit_note_number'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'credit_note.label_credit_note'} />}
            labelInfo={<FieldRequiredHint />}
            inline={true}
            className={classNames(
              'form-group--credit_note_number',
              CLASSES.FILL,
            )}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="credit_note_number" />}
          >
            <ControlGroup fill={true}>
              <InputGroup
                minimal={true}
                value={field.value}
                asyncControl={true}
                onBlur={handleCreditNoBlur(form, field)}
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
          </FormGroup>
        )}
      </Field>
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
export default compose(
  withDialogActions,
  withSettings(({ creditNoteSettings }) => ({
    creditAutoIncrement: creditNoteSettings?.autoIncrement,
    creditNextNumber: creditNoteSettings?.nextNumber,
    creditNumberPrefix: creditNoteSettings?.numberPrefix,
  })),
)(CreditNoteFormHeaderFields);

const CustomerButtonLink = styled(CustomerDrawerLink)`
  font-size: 11px;
  margin-top: 6px;
`;
