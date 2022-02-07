import React from 'react';
import {
  FormGroup,
  InputGroup,
  Position,
  ControlGroup,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FastField, Field, ErrorMessage } from 'formik';
import { FormattedMessage as T, Col, Row } from 'components';
import { momentFormatter, compose, tansformDateValue } from 'utils';
import { upperCase } from 'lodash';

import classNames from 'classnames';
import styled from 'styled-components';

import {
  useObserveInvoiceNoSettings,
  customerNameFieldShouldUpdate,
} from './utils';
import { CLASSES } from 'common/classes';
import {
  CustomerSelectField,
  FieldRequiredHint,
  ListSelect,
  Icon,
  InputPrependButton,
  MoneyInputGroup,
  FlagTag,
} from 'components';
import { useInvoiceFormContext } from './InvoiceFormProvider';

import withSettings from 'containers/Settings/withSettings';
import withDialogActions from 'containers/Dialog/withDialogActions';
import { inputIntent, handleDateChange } from 'utils';
import BaseCurrency from './BaseCurrency';

const Data = [
  {
    id: 10,
    name: 'Due on Receipt',
  },
  {
    id: 20,
    name: 'Due on Receipt',
  },
];

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
      <CustomerName>
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
                }}
                popoverFill={true}
                allowCreate={true}
              />
            </FormGroup>
          )}
        </FastField>
        <BaseCurrency />
      </CustomerName>
      <ExchangeWrapp>
        <ExchangeLable>
          <FlagTag flage={'US'} /> 1 USD =
        </ExchangeLable>

        {/* ----------- Exchange reate ----------- */}
        <Field name={'exchange_rate'}>
          {({
            form: { values, setFieldValue },
            field,
            meta: { error, touched },
          }) => (
            <FormGroup
              intent={inputIntent({ error, touched })}
              inline={true}
              className={'form-group--exchange_rate'}
              helperText={<ErrorMessage name="exchange_rate" />}
            >
              <MoneyInputGroup
                value={field.value}
                allowDecimals={false}
                allowNegativeValue={true}
                onChange={(value) => {
                  setFieldValue('exchange_rate', value);
                }}
                intent={inputIntent({ error, touched })}
              />
            </FormGroup>
          )}
        </Field>
        <ExchangeLable>
          <FlagTag flage={'LY'} /> LYD
        </ExchangeLable>
      </ExchangeWrapp>
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
                  inputProps={{
                    leftIcon: <Icon icon={'date-range'} />,
                  }}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
        <Col className={'col--terms'}>
          {/* ----------- Terms ----------- */}
          <FastField name={'terms'}>
            {({ form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={'Terms'}
                inline={true}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="terms" />}
              >
                <ListSelect
                  items={Data}
                  onItemSelect={({ id }) => {
                    form.setFieldValue('terms', id);
                  }}
                  selectedItem={value}
                  selectedItemProp={'value'}
                  textProp={'name'}
                  popoverProps={{ minimal: true }}
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
                  inputProps={{
                    leftIcon: <Icon icon={'date-range'} />,
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

const CustomerName = styled.div`
  display: flex;
  align-items: baseline;
`;

const ExchangeWrapp = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  max-width: 370px;
  .bp3-form-group.bp3-inline {
    width: 88px;
  }
`;

const ExchangeLable = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 5px;
  font-size: 10px;
  line-height: 1.6;
  padding-bottom: calc(1rem + 1px);
`;
