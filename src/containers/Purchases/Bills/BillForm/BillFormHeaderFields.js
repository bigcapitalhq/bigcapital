import React from 'react';
import { FormGroup, InputGroup, Position } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FormattedMessage as T } from 'components';
import { FastField, ErrorMessage } from 'formik';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';
import {
  VendorSelectField,
  FieldRequiredHint,
  Icon,
  ExchangeRateInputGroup,
  If,
} from 'components';
import { vendorsFieldShouldUpdate } from './utils';

import { useBillFormContext } from './BillFormProvider';
import withDialogActions from 'containers/Dialog/withDialogActions';
import {
  momentFormatter,
  compose,
  tansformDateValue,
  handleDateChange,
  inputIntent,
} from 'utils';

/**
 * Fill form header.
 */
function BillFormHeader() {
  // Bill form context.
  const { vendors, isForeignVendor, setSelectVendor } = useBillFormContext();

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_FIELDS)}>
      {/* ------- Vendor name ------ */}
      <FastField
        name={'vendor_id'}
        vendors={vendors}
        shouldUpdate={vendorsFieldShouldUpdate}
      >
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'vendor_name'} />}
            inline={true}
            className={classNames(CLASSES.FILL, 'form-group--vendor')}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'vendor_id'} />}
          >
            <VendorSelectField
              contacts={vendors}
              selectedContactId={value}
              defaultSelectText={<T id={'select_vender_account'} />}
              onContactSelected={(contact) => {
                form.setFieldValue('vendor_id', contact.id);
                setSelectVendor(contact);
              }}
              popoverFill={true}
              allowCreate={true}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Exchange rate ----------- */}
      <If condition={isForeignVendor}>
        <ExchangeRateInputGroup
          fromCurrency={'USD'}
          toCurrency={'LYD'}
          name={'exchange_rate'}
          formGroupProps={{ label: ' ', inline: true }}
        />
      </If>

      {/* ------- Bill date ------- */}
      <FastField name={'bill_date'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'bill_date'} />}
            inline={true}
            labelInfo={<FieldRequiredHint />}
            className={classNames(CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="bill_date" />}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={tansformDateValue(value)}
              onChange={handleDateChange((formattedDate) => {
                form.setFieldValue('bill_date', formattedDate);
              })}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              inputProps={{ leftIcon: <Icon icon={'date-range'} /> }}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ------- Due date ------- */}
      <FastField name={'due_date'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'due_date'} />}
            inline={true}
            className={classNames(
              'form-group--due-date',
              'form-group--select-list',
              CLASSES.FILL,
            )}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="due_date" />}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={tansformDateValue(value)}
              onChange={handleDateChange((formattedDate) => {
                form.setFieldValue('due_date', formattedDate);
              })}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              inputProps={{
                leftIcon: <Icon icon={'date-range'} />,
              }}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ------- Bill number ------- */}
      <FastField name={'bill_number'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'bill_number'} />}
            inline={true}
            className={('form-group--bill_number', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="bill_number" />}
          >
            <InputGroup minimal={true} {...field} />
          </FormGroup>
        )}
      </FastField>

      {/* ------- Reference ------- */}
      <FastField name={'reference_no'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'reference'} />}
            inline={true}
            className={classNames('form-group--reference', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="reference" />}
          >
            <InputGroup minimal={true} {...field} />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}

export default compose(withDialogActions)(BillFormHeader);
