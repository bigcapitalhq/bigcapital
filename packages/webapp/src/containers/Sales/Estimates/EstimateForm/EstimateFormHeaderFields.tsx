// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { FormGroup, InputGroup, Position, Classes } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FastField, ErrorMessage } from 'formik';

import {
  FeatureCan,
  FFormGroup,
  FormattedMessage as T,
  CustomerSelectField,
  FieldRequiredHint,
  Icon,
  CustomerDrawerLink,
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

import { ProjectsSelect } from '@/containers/Projects/components';
import {
  EstimateExchangeRateInputField,
  EstimateProjectSelectButton,
} from './components';
import { EstimateFormEstimateNumberField } from './EstimateFormEstimateNumberField';
import { useEstimateFormContext } from './EstimateFormProvider';

/**
 * Estimate form header.
 */
export default function EstimateFormHeader() {
  const { customers, projects } = useEstimateFormContext();

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_FIELDS)}>
      {/* ----------- Customer name ----------- */}
      <FastField
        name={'customer_id'}
        customers={customers}
        shouldUpdate={customersFieldShouldUpdate}
      >
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'customer_name'} />}
            inline={true}
            className={classNames(CLASSES.FILL, 'form-group--customer')}
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
                form.setFieldValue('currency_code', customer?.currency_code);
              }}
              popoverFill={true}
              intent={inputIntent({ error, touched })}
              allowCreate={true}
            />

            {value && (
              <CustomerButtonLink customerId={value}>
                <T id={'view_customer_details'} />
              </CustomerButtonLink>
            )}
          </FormGroup>
        )}
      </FastField>

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

const CustomerButtonLink = styled(CustomerDrawerLink)`
  font-size: 11px;
  margin-top: 6px;
`;
