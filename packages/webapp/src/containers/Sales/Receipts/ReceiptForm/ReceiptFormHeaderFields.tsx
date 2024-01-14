// @ts-nocheck
import React, { useCallback } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { FormGroup, InputGroup, Position, Classes } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FastField, ErrorMessage, useFormikContext } from 'formik';

import { CLASSES } from '@/constants/classes';
import { ACCOUNT_TYPE } from '@/constants/accountTypes';
import { Features } from '@/constants';
import {
  FFormGroup,
  AccountsSelect,
  CustomersSelect,
  FieldRequiredHint,
  Icon,
  CustomerDrawerLink,
  FormattedMessage as T,
  FeatureCan,
} from '@/components';
import { ProjectsSelect } from '@/containers/Projects/components';
import {
  momentFormatter,
  tansformDateValue,
  handleDateChange,
  inputIntent,
} from '@/utils';
import { useReceiptFormContext } from './ReceiptFormProvider';
import { accountsFieldShouldUpdate, customersFieldShouldUpdate } from './utils';
import {
  ReceiptExchangeRateInputField,
  ReceiptProjectSelectButton,
} from './components';
import { ReceiptFormReceiptNumberField } from './ReceiptFormReceiptNumberField';
import { useCustomerUpdateExRate } from '@/containers/Entries/withExRateItemEntriesPriceRecalc';

/**
 * Receipt form header fields.
 */
export default function ReceiptFormHeader() {
  const { accounts, projects } = useReceiptFormContext();

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_FIELDS)}>
      {/* ----------- Customer name ----------- */}
      <ReceiptFormCustomerSelect />

      {/* ----------- Exchange rate ----------- */}
      <ReceiptExchangeRateInputField />

      {/* ----------- Deposit account ----------- */}
      <FFormGroup
        label={<T id={'deposit_account'} />}
        inline={true}
        labelInfo={<FieldRequiredHint />}
        name={'deposit_account_id'}
        items={accounts}
        fastField={true}
        shouldUpdate={accountsFieldShouldUpdate}
      >
        <AccountsSelect
          items={accounts}
          name={'deposit_account_id'}
          placeholder={<T id={'select_deposit_account'} />}
          filterByTypes={[
            ACCOUNT_TYPE.CASH,
            ACCOUNT_TYPE.BANK,
            ACCOUNT_TYPE.OTHER_CURRENT_ASSET,
          ]}
          allowCreate={true}
          fill={true}
          fastField={true}
          shouldUpdate={accountsFieldShouldUpdate}
        />
      </FFormGroup>

      {/* ----------- Receipt date ----------- */}
      <FastField name={'receipt_date'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'receipt_date'} />}
            inline={true}
            className={classNames(CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="receipt_date" />}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={tansformDateValue(value)}
              onChange={handleDateChange((formattedDate) => {
                form.setFieldValue('receipt_date', formattedDate);
              })}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              inputProps={{
                leftIcon: <Icon icon={'date-range'} />,
              }}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Receipt number ----------- */}
      <ReceiptFormReceiptNumberField />

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
          label={<T id={'receipt.project_name.label'} />}
          inline={true}
          className={classNames('form-group--select-list', Classes.FILL)}
        >
          <ProjectsSelect
            name={'project_id'}
            projects={projects}
            input={ReceiptProjectSelectButton}
            popoverFill={true}
          />
        </FFormGroup>
      </FeatureCan>
    </div>
  );
}

/**
 * Customer select field of receipt form.
 * @returns {React.ReactNode}
 */
function ReceiptFormCustomerSelect() {
  const { setFieldValue, values } = useFormikContext();
  const { customers } = useReceiptFormContext();

  const updateEntries = useCustomerUpdateExRate();

  // Handles the customer item change.
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
      shouldUpdate={customersFieldShouldUpdate}
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
        shouldUpdate={customersFieldShouldUpdate}
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
