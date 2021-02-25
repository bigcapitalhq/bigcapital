import React from 'react';
import {
  FormGroup,
  InputGroup,
  Position,
  ControlGroup,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FastField, ErrorMessage } from 'formik';
import { FormattedMessage as T } from 'react-intl';
import { momentFormatter, compose, tansformDateValue } from 'utils';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import {
  ContactSelecetList,
  FieldRequiredHint,
  Icon,
  InputPrependButton,
} from 'components';

import { useInvoiceFormContext } from './InvoiceFormProvider';
import withDialogActions from 'containers/Dialog/withDialogActions';
import { inputIntent, handleDateChange } from 'utils';

/**
 * Invoice form header fields.
 */
function InvoiceFormHeaderFields({
  // #withDialogActions
  openDialog,
}) {
  // Invoice form context.
  const { customers } = useInvoiceFormContext();

  // Handle invoice number changing.
  const handleInvoiceNumberChange = () => {
    openDialog('invoice-number-form', {});
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_FIELDS)}>
      {/* ----------- Customer name ----------- */}
      <FastField name={'customer_id'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'customer_name'} />}
            inline={true}
            className={classNames('form-group--customer-name', 'form-group--select-list', CLASSES.FILL)}
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

      {/* ----------- Invoice date ----------- */}
      <FastField name={'invoice_date'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'invoice_date'} />}
            inline={true}
            labelInfo={<FieldRequiredHint />}
            className={classNames('form-group--invoice-date', CLASSES.FILL)}
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

      {/* ----------- Due date ----------- */}
      <FastField name={'due_date'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'due_date'} />}
            inline={true}
            className={classNames('form-group--due-date', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="due_date" />}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={tansformDateValue(value)}
              onChange={handleDateChange((formattedDate) => {
                form.setFieldValue('due_date', formattedDate);
              })}
              popoverProps={{ position: Position.BOTTOM_LEFT, minimal: true }}
              inputProps={{
                leftIcon: <Icon icon={'date-range'} />,
              }}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Invoice number ----------- */}
      <FastField name={'invoice_no'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'invoice_no'} />}
            inline={true}
            className={classNames('form-group--invoice-no', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="invoice_no" />}
          >
            <ControlGroup fill={true}>
              <InputGroup
                minimal={true}
                {...field}
              />
              <InputPrependButton
                buttonProps={{
                  onClick: handleInvoiceNumberChange,
                  icon: <Icon icon={'settings-18'} />,
                }}
                tooltip={true}
                tooltipProps={{
                  content: 'Setting your auto-generated invoice number',
                  position: Position.BOTTOM_LEFT,
                }}
              />
            </ControlGroup>
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Reference ----------- */}
      <FastField name={'reference'}>
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

export default compose(
  withDialogActions,
)(InvoiceFormHeaderFields);
