// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { FormGroup, InputGroup, Position } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FastField, ErrorMessage, useFormikContext } from 'formik';
import { css } from '@emotion/css';
import { useTheme } from '@emotion/react';

import { CLASSES } from '@/constants/classes';
import {
  FieldRequiredHint,
  Icon,
  FormattedMessage as T,
  CustomerDrawerLink,
  FFormGroup,
  CustomersSelect,
  Stack,
} from '@/components';
import { customerNameFieldShouldUpdate } from './utils';

import { useCreditNoteFormContext } from './CreditNoteFormProvider';
import { CreditNoteExchangeRateInputField } from './components';
import { CreditNoteTransactionNoField } from './CreditNoteTransactionNoField';
import {
  momentFormatter,
  tansformDateValue,
  inputIntent,
  handleDateChange,
} from '@/utils';
import { useCustomerUpdateExRate } from '@/containers/Entries/withExRateItemEntriesPriceRecalc';

const getCreditNoteFieldsStyle = (theme: Theme) => css`
  .${theme.bpPrefix}-form-group {
    margin-bottom: 0;

    &.${theme.bpPrefix}-inline {
      max-width: 450px;
    }
    .${theme.bpPrefix}-label {
      min-width: 150px;
    }
    .${theme.bpPrefix}-form-content {
      width: 100%;
    }
  }
`;

/**
 * Credit note form header fields.
 */
export default function CreditNoteFormHeaderFields() {
  const theme = useTheme();
  const styleClassName = getCreditNoteFieldsStyle(theme);

  return (
    <Stack spacing={18} flex={1} className={styleClassName}>
      {/* ----------- Customer name ----------- */}
      <CreditNoteCustomersSelect />

      {/* ----------- Exchange rate ----------- */}
      <CreditNoteExchangeRateInputField />

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
      <FormGroup label={<T id={'reference_no'} />} name={'reference_no'} inline>
        <InputGroup name={'reference_no'} minimal />
      </FormGroup>
    </Stack>
  );
}

/**
 * Customer select field of credit note form.
 * @returns {React.ReactNode}
 */
function CreditNoteCustomersSelect() {
  // Credit note form context.
  const { setFieldValue, values } = useFormikContext();
  const { customers } = useCreditNoteFormContext();

  const updateEntries = useCustomerUpdateExRate();

  // Handles item change.
  const handleItemChange = (customer) => {
    setFieldValue('customer_id', customer.id);
    setFieldValue('currency_code', customer?.currency_code);

    updateEntries(customer);
  };

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
        onItemChange={handleItemChange}
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
