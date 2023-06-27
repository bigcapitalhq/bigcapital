// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { FormGroup, InputGroup, Position, Classes } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FastField, ErrorMessage, useFormikContext } from 'formik';

import {
  FFormGroup,
  FormattedMessage as T,
  Col,
  Row,
  CustomerDrawerLink,
  FieldRequiredHint,
  FeatureCan,
  CustomersSelect,
} from '@/components';
import {
  momentFormatter,
  transformDateValue,
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
import { InvoiceFormInvoiceNumberField } from './InvoiceFormInvoiceNumberField';
import {
  ProjectsSelect,
  ProjectBillableEntriesLink,
} from '@/containers/Projects/components';
import { Features } from '@/constants';

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
                  value={transformDateValue(value)}
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
                  value={transformDateValue(value)}
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
