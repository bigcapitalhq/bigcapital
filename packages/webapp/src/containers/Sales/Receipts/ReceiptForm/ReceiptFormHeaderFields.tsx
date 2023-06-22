// @ts-nocheck
import React, { useCallback } from 'react';
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

import { CLASSES } from '@/constants/classes';
import { ACCOUNT_TYPE } from '@/constants/accountTypes';
import { Features } from '@/constants';
import {
  FFormGroup,
  AccountsSelect,
  CustomerSelectField,
  FieldRequiredHint,
  Icon,
  InputPrependButton,
  CustomerDrawerLink,
  FormattedMessage as T,
  FeatureCan,
  FInputGroup,
  CustomersSelect,
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

import withSettings from '@/containers/Settings/withSettings';
import withDialogActions from '@/containers/Dialog/withDialogActions';

/**
 * Receipt number field of receipt form.
 */
const ReceiptFormReceiptNumberField = R.compose(
  withDialogActions,
  withSettings(({ receiptSettings }) => ({
    receiptAutoIncrement: receiptSettings?.autoIncrement,
  })),
)(
  ({
    // #withDialogActions
    openDialog,

    // #withSettings
    receiptAutoIncrement,
  }) => {
    const { values, setFieldValue } = useFormikContext();

    const handleReceiptNumberChange = () => {
      openDialog('receipt-number-form', {});
    };

    const handleReceiptNoBlur = (event) => {
      const newValue = event.target.value;

      // Show the confirmation dialog if the value has changed and auto-increment
      // mode is enabled.
      if (values.receipt_number !== newValue && receiptAutoIncrement) {
        openDialog('receipt-number-form', {
          initialFormValues: {
            onceManualNumber: newValue,
            incrementMode: 'manual-transaction',
          },
        });
      }
      // Setting the receipt number to the form will be manually in case
      // auto-increment is disable.
      if (!receiptAutoIncrement) {
        setFieldValue('receipt_number', newValue);
        setFieldValue('receipt_number_manually', newValue);
      }
    };

    return (
      <FFormGroup
        name={'receipt_number'}
        label={<T id={'receipt'} />}
        inline={true}
        labelInfo={<FieldRequiredHint />}
      >
        <ControlGroup fill={true}>
          <FInputGroup
            name={'receipt_number'}
            minimal={true}
            value={values.receipt_number}
            asyncControl={true}
            onBlur={handleReceiptNoBlur}
            onChange={() => {}}
          />
          <InputPrependButton
            buttonProps={{
              onClick: handleReceiptNumberChange,
              icon: <Icon icon={'settings-18'} />,
            }}
            tooltip={true}
            tooltipProps={{
              content: (
                <T id={'setting_your_auto_generated_payment_receive_number'} />
              ),
              position: Position.BOTTOM_LEFT,
            }}
            inputProps={{
              leftIcon: <Icon icon={'date-range'} />,
            }}
          />
        </ControlGroup>
      </FFormGroup>
    );
  },
);

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
      <ReceiptExchangeRateInputField
        name={'exchange_rate'}
        formGroupProps={{ label: ' ', inline: true }}
      />

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

  return (
    <FFormGroup
      name={'customer_id'}
      label={<T id={'customer_name'} />}
      inline={true}
      labelInfo={<FieldRequiredHint />}
      customers={customers}
      fastField={true}
      shouldUpdate={customersFieldShouldUpdate}
    >
      <CustomersSelect
        name={'customer_id'}
        items={customers}
        placeholder={<T id={'select_customer_account'} />}
        onItemChange={(customer) => {
          setFieldValue('customer_id', customer.id);
          setFieldValue('currency_code', customer?.currency_code);
        }}
        popoverFill={true}
        allowCreate={true}
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
