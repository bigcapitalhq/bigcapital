import React from 'react';
import {
  FormGroup,
  InputGroup,
  Position,
  ControlGroup,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FastField, Field, ErrorMessage } from 'formik';
import styled from 'styled-components';
import classNames from 'classnames';

import {
  FFormGroup,
  FormattedMessage as T,
  Col,
  Row,
  CustomerDrawerLink,
} from 'components';
import { momentFormatter, compose, tansformDateValue } from 'utils';

import {
  useObserveInvoiceNoSettings,
  customerNameFieldShouldUpdate,
} from './utils';
import { CLASSES } from 'common/classes';
import {
  CustomerSelectField,
  FieldRequiredHint,
  Icon,
  InputPrependButton,
} from 'components';
import { useInvoiceFormContext } from './InvoiceFormProvider';
import { InvoiceExchangeRateInputField } from './components';

import withSettings from 'containers/Settings/withSettings';
import withDialogActions from 'containers/Dialog/withDialogActions';
import { inputIntent, handleDateChange } from 'utils';

/**
 * Invoice form header fields.
 */
function InvoiceFormHeaderFields({
  // #withDialogActions
  openDialog,

  // #withSettings
  invoiceAutoIncrement,
  invoiceNumberPrefix,
  invoiceNextNumber,
}) {
  // Invoice form context.
  const { customers } = useInvoiceFormContext();

  // Handle invoice number changing.
  const handleInvoiceNumberChange = () => {
    openDialog('invoice-number-form');
  };
  // Handle invoice no. field blur.
  const handleInvoiceNoBlur = (form, field) => (event) => {
    const newValue = event.target.value;

    if (field.value !== newValue && invoiceAutoIncrement) {
      openDialog('invoice-number-form', {
        initialFormValues: {
          manualTransactionNo: newValue,
          incrementMode: 'manual-transaction',
        },
      });
    }
  };
  // Syncs invoice number settings with form.
  useObserveInvoiceNoSettings(invoiceNumberPrefix, invoiceNextNumber);

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_FIELDS)}>
      {/* ----------- Customer name ----------- */}
      <FastField
        name={'customer_id'}
        customers={customers}
        shouldUpdate={customerNameFieldShouldUpdate}
      >
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FFormGroup
            name={'customer_id'}
            label={<T id={'customer_name'} />}
            inline={true}
            className={classNames(
              'form-group--customer-name',
              'form-group--select-list',
              CLASSES.FILL,
            )}
            labelInfo={<FieldRequiredHint />}
          >
            <ControlCustomerGroup>
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
              {/* <InvoiceCurrencyTag /> */}
            </ControlCustomerGroup>
            {value && (
              <CustomerButtonLink customerId={value}>
                View Customer Details
              </CustomerButtonLink>
            )}
          </FFormGroup>
        )}
      </FastField>

      {/* ----------- Exchange rate ----------- */}
      <InvoiceExchangeRateInputField
        name={'exchange_rate'}
        formGroupProps={{ label: ' ', inline: true }}
      />
      <Row>
        <Col xs={6}>
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
                  popoverProps={{
                    position: Position.BOTTOM_LEFT,
                    minimal: true,
                  }}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>

        <Col className={'col--due-date'}>
          {/* ----------- Due date ----------- */}
          <FastField name={'due_date'}>
            {({ form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'due_date'} />}
                labelInfo={<FieldRequiredHint />}
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
                  popoverProps={{
                    position: Position.BOTTOM_LEFT,
                    minimal: true,
                  }}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>

      {/* ----------- Invoice number ----------- */}
      <Field name={'invoice_no'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'invoice_no'} />}
            labelInfo={<FieldRequiredHint />}
            inline={true}
            className={classNames('form-group--invoice-no', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="invoice_no" />}
          >
            <ControlGroup fill={true}>
              <InputGroup
                minimal={true}
                value={field.value}
                asyncControl={true}
                onBlur={handleInvoiceNoBlur(form, field)}
              />
              <InputPrependButton
                buttonProps={{
                  onClick: handleInvoiceNumberChange,
                  icon: <Icon icon={'settings-18'} />,
                }}
                tooltip={true}
                tooltipProps={{
                  content: (
                    <T id={'setting_your_auto_generated_invoice_number'} />
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
            label={<T id={'reference'} />}
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
  withSettings(({ invoiceSettings }) => ({
    invoiceAutoIncrement: invoiceSettings?.autoIncrement,
    invoiceNextNumber: invoiceSettings?.nextNumber,
    invoiceNumberPrefix: invoiceSettings?.numberPrefix,
  })),
)(InvoiceFormHeaderFields);

const ControlCustomerGroup = styled(ControlGroup)`
  display: flex;
  align-items: center;
  transform: none;
`;

const CustomerButtonLink = styled(CustomerDrawerLink)`
  font-size: 11px;
  margin-top: 6px;
`;
