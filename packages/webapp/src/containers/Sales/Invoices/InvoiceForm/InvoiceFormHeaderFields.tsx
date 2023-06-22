// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import {
  FormGroup,
  InputGroup,
  Position,
  Classes,
  ControlGroup,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FastField, ErrorMessage, useFormikContext, useFormik } from 'formik';
import * as R from 'ramda';

import {
  FFormGroup,
  FormattedMessage as T,
  Col,
  Row,
  CustomerDrawerLink,
  FieldRequiredHint,
  Icon,
  InputPrependButton,
  FeatureCan,
  FInputGroup,
  CustomersSelect,
} from '@/components';
import {
  momentFormatter,
  tansformDateValue,
  inputIntent,
  handleDateChange,
} from '@/utils';
import { CLASSES } from '@/constants/classes';
import { customerNameFieldShouldUpdate } from './utils';

import { useInvoiceFormContext } from './InvoiceFormProvider';
import {
  InvoiceExchangeRateInputField,
  InvoiceProjectSelectButton,
} from './components';
import {
  ProjectsSelect,
  ProjectBillableEntriesLink,
} from '@/containers/Projects/components';
import { Features } from '@/constants';
import { DialogsName } from '@/constants/dialogs';

import withSettings from '@/containers/Settings/withSettings';
import withDialogActions from '@/containers/Dialog/withDialogActions';

/**
 * Invoice number field of invoice form.
 */
const InvoiceFormInvoiceNumberField = R.compose(
  withDialogActions,
  withSettings(({ invoiceSettings }) => ({
    invoiceAutoIncrement: invoiceSettings?.autoIncrement,
  })),
)(
  ({
    // #withDialogActions
    openDialog,

    // #withSettings
    invoiceAutoIncrement,
  }) => {
    // Formik context.
    const { values, setFieldValue } = useFormikContext();

    // Handle invoice number changing.
    const handleInvoiceNumberChange = () => {
      openDialog(DialogsName.InvoiceNumberSettings);
    };
    // Handle invoice no. field blur.
    const handleInvoiceNoBlur = (event) => {
      const newValue = event.target.value;

      // Show the confirmation dialog if the value has changed and auto-increment
      // mode is enabled.
      if (values.invoice_no !== newValue && invoiceAutoIncrement) {
        openDialog(DialogsName.InvoiceNumberSettings, {
          initialFormValues: {
            onceManualNumber: newValue,
            incrementMode: 'manual-transaction',
          },
        });
      }
      // Setting the invoice number to the form will be manually in case
      // auto-increment is disable.
      if (!invoiceAutoIncrement) {
        setFieldValue('invoice_no', newValue);
        setFieldValue('invoice_no_manually', newValue);
      }
    };

    return (
      <FFormGroup
        name={'invoice_no'}
        label={<T id={'invoice_no'} />}
        labelInfo={<FieldRequiredHint />}
        inline={true}
        fastField={true}
      >
        <ControlGroup fill={true}>
          <FInputGroup
            name={'invoice_no'}
            minimal={true}
            asyncControl={true}
            onBlur={handleInvoiceNoBlur}
            onChange={() => {}}
          />
          <InputPrependButton
            buttonProps={{
              onClick: handleInvoiceNumberChange,
              icon: <Icon icon={'settings-18'} />,
            }}
            tooltip={true}
            tooltipProps={{
              content: <T id={'setting_your_auto_generated_invoice_number'} />,
              position: Position.BOTTOM_LEFT,
            }}
          />
        </ControlGroup>
      </FFormGroup>
    );
  },
);
InvoiceFormInvoiceNumberField.displayName = 'InvoiceFormInvoiceNumberField';

/**
 * Invoice form header fields.
 */
export default function InvoiceFormHeaderFields() {
  // Invoice form context.
  const { projects } = useInvoiceFormContext();
  const { values } = useFormikContext();

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_FIELDS)}>
      {/* ----------- Customer name ----------- */}
      <InvoiceFormCustomerSelect />

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

        <Col xs={6}>
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
      <InvoiceFormInvoiceNumberField />

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

      {/*------------ Project name -----------*/}
      <FeatureCan feature={Features.Projects}>
        <FFormGroup
          name={'project_id'}
          label={<T id={'invoice.project_name.label'} />}
          inline={true}
          className={classNames('form-group--select-list', Classes.FILL)}
        >
          <ProjectsSelect
            name={'project_id'}
            projects={projects}
            input={InvoiceProjectSelectButton}
            popoverFill={true}
          />
          {values?.project_id && (
            <ProjectBillableEntriesLink projectId={values?.project_id}>
              <T id={'add_billable_entries'} />
            </ProjectBillableEntriesLink>
          )}
        </FFormGroup>
      </FeatureCan>
    </div>
  );
}

/**
 * Customer select field of the invoice form.
 * @returns {React.ReactNode}
 */
function InvoiceFormCustomerSelect() {
  const { customers } = useInvoiceFormContext();
  const { values, setFieldValue } = useFormikContext();

  return (
    <FFormGroup
      name={'customer_id'}
      label={<T id={'customer_name'} />}
      inline={true}
      labelInfo={<FieldRequiredHint />}
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
