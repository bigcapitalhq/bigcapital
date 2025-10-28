// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Position, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { css } from '@emotion/css';
import { Theme, useTheme } from '@emotion/react';

import {
  FFormGroup,
  FormattedMessage as T,
  CustomerDrawerLink,
  FieldRequiredHint,
  FeatureCan,
  CustomersSelect,
  Stack,
  FInputGroup,
  Icon,
  FDateInput,
} from '@/components';
import { customerNameFieldShouldUpdate } from './utils';

import { useInvoiceFormContext } from './InvoiceFormProvider';
import { useCustomerUpdateExRate } from '@/containers/Entries/withExRateItemEntriesPriceRecalc';
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

const getInvoiceFieldsStyle = (theme: Theme) => css`
  .${theme.bpPrefix}-form-group {
    margin-bottom: 0;

    &.${theme.bpPrefix}-inline {
      max-width: 450px;
    }
    .${theme.bpPrefix}-label {
      min-width: 150px;
      font-weight: 500;
    }
    .${theme.bpPrefix}-form-content {
      width: 100%;
    }
  }
`;

/**
 * Invoice form header fields.
 */
export default function InvoiceFormHeaderFields() {
  const theme = useTheme();
  const { projects } = useInvoiceFormContext();
  const { values } = useFormikContext();
  const invoiceFieldsClassName = getInvoiceFieldsStyle(theme);

  return (
    <Stack spacing={18} flex={1} className={invoiceFieldsClassName}>
      {/* ----------- Customer name ----------- */}
      <InvoiceFormCustomerSelect />

      {/* ----------- Exchange rate ----------- */}
      <InvoiceExchangeRateInputField />

      {/* ----------- Invoice date ----------- */}
      <FFormGroup
        name={'invoice_date'}
        label={<T id={'invoice_date'} />}
        labelInfo={<FieldRequiredHint />}
        inline
        fastField
      >
        <FDateInput
          name={'invoice_date'}
          formatDate={(date) => date.toLocaleDateString()}
          parseDate={(str) => new Date(str)}
          popoverProps={{
            position: Position.BOTTOM_LEFT,
            minimal: true,
            fill: true,
          }}
          inputProps={{
            leftIcon: <Icon icon={'date-range'} />,
          }}
          fill
          fastField
        />
      </FFormGroup>

      {/* ----------- Due date ----------- */}
      <FFormGroup
        name={'due_date'}
        label={<T id={'due_date'} />}
        labelInfo={<FieldRequiredHint />}
        inline
        fastField
      >
        <FDateInput
          name={'due_date'}
          formatDate={(date) => date.toLocaleDateString()}
          parseDate={(str) => new Date(str)}
          popoverProps={{
            position: Position.BOTTOM_LEFT,
            minimal: true,
            fill: true,
          }}
          inputProps={{
            leftIcon: <Icon icon={'date-range'} />,
            fill: true,
          }}
          fill
          fastField
        />
      </FFormGroup>

      {/* ----------- Invoice number ----------- */}
      <InvoiceFormInvoiceNumberField />

      {/* ----------- Reference ----------- */}
      <FFormGroup name={'reference_no'} label={<T id={'reference'} />} inline>
        <FInputGroup name={'reference_no'} minimal={true} />
      </FFormGroup>

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
    </Stack>
  );
}

/**
 * Customer select field of the invoice form.
 * @returns {React.ReactNode}
 */
function InvoiceFormCustomerSelect() {
  const { values, setFieldValue } = useFormikContext();
  const { customers } = useInvoiceFormContext();

  const updateEntries = useCustomerUpdateExRate();

  // Handles the customer item change.
  const handleItemChange = (customer) => {
    // If the customer id has changed change the customer id and currency code.
    if (values.customer_id !== customer.id) {
      setFieldValue('customer_id', customer.id);
      setFieldValue('currency_code', customer?.currency_code);
    }
    updateEntries(customer);
  };

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
        onItemChange={handleItemChange}
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
