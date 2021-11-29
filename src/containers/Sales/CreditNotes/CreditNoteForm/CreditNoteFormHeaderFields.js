import React from 'react';
import { FormGroup, InputGroup, Position } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FastField, Field, ErrorMessage } from 'formik';
import { CLASSES } from 'common/classes';
import classNames from 'classnames';
import {
  ContactSelecetList,
  FieldRequiredHint,
  Icon,
  FormattedMessage as T,
} from 'components';
import { customerNameFieldShouldUpdate } from './utils';

import { useCreditNoteFormContext } from './CreditNoteFormProvider';
import withSettings from 'containers/Settings/withSettings';
import withDialogActions from 'containers/Dialog/withDialogActions';

import {
  momentFormatter,
  compose,
  tansformDateValue,
  inputIntent,
  handleDateChange,
} from 'utils';

/**
 * Credit note form header fields.
 */
function CreditNoteFormHeaderFields() {
  
  // Credit note form context.
  const { customers } = useCreditNoteFormContext();
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
            <ContactSelecetList
              contactsList={customers}
              selectedContactId={value}
              defaultSelectText={<T id={'select_customer_account'} />}
              onContactSelected={(customer) => {
                form.setFieldValue('customer_id', customer.id);
              }}
              popoverFill={true}
            />
          </FormGroup>
        )}
      </FastField>
      {/* ----------- Credit note date ----------- */}
      <FastField name={'invoice_date'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'credit_note.label_credit_note_date'} />}
            inline={true}
            labelInfo={<FieldRequiredHint />}
            className={classNames('form-group--credit_note_date', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="invoice_date" />}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={tansformDateValue(value)}
              onChange={handleDateChange((formattedDate) => {
                form.setFieldValue('invoice_date', formattedDate);
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
      <Field name={'invoice_no'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'credit_note.label_credit_note'} />}
            labelInfo={<FieldRequiredHint />}
            inline={true}
            className={classNames('form-group--invoice-no', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="invoice_no" />}
          >
            <InputGroup minimal={true} {...field} />
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

export default CreditNoteFormHeaderFields;
