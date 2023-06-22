// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
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

import {
  FeatureCan,
  FFormGroup,
  FInputGroup,
  FormattedMessage as T,
  FieldRequiredHint,
  Icon,
  InputPrependButton,
  CustomerDrawerLink,
  CustomersSelect,
} from '@/components';
import {
  momentFormatter,
  tansformDateValue,
  inputIntent,
  handleDateChange,
} from '@/utils';
import { customersFieldShouldUpdate } from './utils';
import { CLASSES } from '@/constants/classes';
import { Features } from '@/constants';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import withSettings from '@/containers/Settings/withSettings';

import { ProjectsSelect } from '@/containers/Projects/components';
import {
  EstimateExchangeRateInputField,
  EstimateProjectSelectButton,
} from './components';
import { useEstimateFormContext } from './EstimateFormProvider';

/**
 * Estimate number field of estimate form.
 */
const EstimateFormEstimateNumberField = R.compose(
  withDialogActions,
  withSettings(({ estimatesSettings }) => ({
    estimateNextNumber: estimatesSettings?.nextNumber,
    estimateNumberPrefix: estimatesSettings?.numberPrefix,
    estimateAutoIncrement: estimatesSettings?.autoIncrement,
  })),
)(
  ({
    // #withDialogActions
    openDialog,

    // #withSettings
    estimateAutoIncrement,
  }) => {
    const { values, setFieldValue } = useFormikContext();

    const handleEstimateNumberBtnClick = () => {
      openDialog('estimate-number-form', {});
    };
    // Handle estimate no. field blur.
    const handleEstimateNoBlur = (event) => {
      const newValue = event.target.value;

      // Show the confirmation dialog if the value has changed and auto-increment
      // mode is enabled.
      if (values.estimate_number !== newValue && estimateAutoIncrement) {
        openDialog('estimate-number-form', {
          initialFormValues: {
            onceManualNumber: newValue,
            incrementMode: 'manual-transaction',
          },
        });
      }
      // Setting the estimate number to the form will be manually in case
      // auto-increment is disable.
      if (!estimateAutoIncrement) {
        setFieldValue('estimate_number', newValue);
        setFieldValue('estimate_number_manually', newValue);
      }
    };

    return (
      <FFormGroup
        name={'estimate_number'}
        label={<T id={'estimate'} />}
        inline={true}
      >
        <ControlGroup fill={true}>
          <FInputGroup
            name={'estimate_number'}
            minimal={true}
            asyncControl={true}
            onBlur={handleEstimateNoBlur}
            onChange={() => {}}
          />
          <InputPrependButton
            buttonProps={{
              onClick: handleEstimateNumberBtnClick,
              icon: <Icon icon={'settings-18'} />,
            }}
            tooltip={true}
            tooltipProps={{
              content: <T id={'setting_your_auto_generated_estimate_number'} />,
              position: Position.BOTTOM_LEFT,
            }}
          />
        </ControlGroup>
      </FFormGroup>
    );
  },
);

/**
 * Estimate form header.
 */
export default function EstimateFormHeader() {
  const { customers, projects } = useEstimateFormContext();

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_FIELDS)}>
      {/* ----------- Customer name ----------- */}
      <EstimateFormCustomerSelect />

      {/* ----------- Exchange Rate ----------- */}
      <EstimateExchangeRateInputField
        name={'exchange_rate'}
        formGroupProps={{ label: ' ', inline: true }}
      />
      {/* ----------- Estimate Date ----------- */}
      <FastField name={'estimate_date'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'estimate_date'} />}
            inline={true}
            labelInfo={<FieldRequiredHint />}
            className={classNames(CLASSES.FILL, 'form-group--estimate-date')}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="estimate_date" />}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={tansformDateValue(value)}
              onChange={handleDateChange((formattedDate) => {
                form.setFieldValue('estimate_date', formattedDate);
              })}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              inputProps={{
                leftIcon: <Icon icon={'date-range'} />,
              }}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Expiration date ----------- */}
      <FastField name={'expiration_date'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'expiration_date'} />}
            labelInfo={<FieldRequiredHint />}
            inline={true}
            className={classNames(
              CLASSES.FORM_GROUP_LIST_SELECT,
              CLASSES.FILL,
              'form-group--expiration-date',
            )}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="expiration_date" />}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={tansformDateValue(value)}
              onChange={handleDateChange((formattedDate) => {
                form.setFieldValue('expiration_date', formattedDate);
              })}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              inputProps={{
                leftIcon: <Icon icon={'date-range'} />,
              }}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Estimate number ----------- */}
      <EstimateFormEstimateNumberField />

      {/* ----------- Reference ----------- */}
      <FastField name={'reference'}>
        {({ form, field, meta: { error, touched } }) => (
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

      {/*------------ Project name -----------*/}
      <FeatureCan feature={Features.Projects}>
        <FFormGroup
          name={'project_id'}
          label={<T id={'estimate.project_name.label'} />}
          inline={true}
          className={classNames('form-group--select-list', Classes.FILL)}
        >
          <ProjectsSelect
            name={'project_id'}
            projects={projects}
            input={EstimateProjectSelectButton}
            popoverFill={true}
          />
        </FFormGroup>
      </FeatureCan>
    </div>
  );
}

/**
 * Customer select field of estimate form.
 * @returns {React.ReactNode}
 */
function EstimateFormCustomerSelect() {
  const { setFieldValue, values } = useFormikContext();
  const { customers } = useEstimateFormContext();

  return (
    <FFormGroup
      label={<T id={'customer_name'} />}
      inline={true}
      labelInfo={<FieldRequiredHint />}
      name={'customer_id'}
      customers={customers}
      shouldUpdate={customersFieldShouldUpdate}
      fastField={true}
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
        fastField={true}
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
