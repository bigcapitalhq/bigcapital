import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { FormGroup, InputGroup, Classes, Position } from '@blueprintjs/core';
import { FastField, ErrorMessage } from 'formik';
import { DateInput } from '@blueprintjs/datetime';
import { FormattedMessage as T } from '@/components';
import { CLASSES } from '@/constants/classes';

import {
  FFormGroup,
  VendorSelectField,
  FieldRequiredHint,
  Icon,
  VendorDrawerLink,
} from '@/components';

import { useBillFormContext } from './BillFormProvider';
import { vendorsFieldShouldUpdate } from './utils';
import {
  BillExchangeRateInputField,
  BillProjectSelectButton,
} from './components';
import { ProjectsSelect } from '@/containers/Projects/components';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import {
  momentFormatter,
  compose,
  tansformDateValue,
  handleDateChange,
  inputIntent,
} from '@/utils';

/**
 * Fill form header.
 */
function BillFormHeader() {
  // Bill form context.
  const { vendors, projects } = useBillFormContext();

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_FIELDS)}>
      {/* ------- Vendor name ------ */}
      <FastField
        name={'vendor_id'}
        vendors={vendors}
        shouldUpdate={vendorsFieldShouldUpdate}
      >
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FFormGroup
            name={'vendor_id'}
            label={<T id={'vendor_name'} />}
            inline={true}
            className={classNames(
              'form-group--vendor-name',
              'form-group--select-list',
              CLASSES.FILL,
            )}
            labelInfo={<FieldRequiredHint />}
          >
            <VendorSelectField
              contacts={vendors}
              selectedContactId={value}
              defaultSelectText={<T id={'select_vender_account'} />}
              onContactSelected={(contact) => {
                form.setFieldValue('vendor_id', contact.id);
                form.setFieldValue('currency_code', contact?.currency_code);
              }}
              popoverFill={true}
              allowCreate={true}
            />

            {value && (
              <VendorButtonLink vendorId={value}>
                <T id={'view_vendor_details'} />
              </VendorButtonLink>
            )}
          </FFormGroup>
        )}
      </FastField>

      {/* ----------- Exchange rate ----------- */}
      <BillExchangeRateInputField
        name={'exchange_rate'}
        formGroupProps={{ label: ' ', inline: true }}
      />

      {/* ------- Bill date ------- */}
      <FastField name={'bill_date'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'bill_date'} />}
            inline={true}
            labelInfo={<FieldRequiredHint />}
            className={classNames(CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="bill_date" />}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={tansformDateValue(value)}
              onChange={handleDateChange((formattedDate) => {
                form.setFieldValue('bill_date', formattedDate);
              })}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              inputProps={{ leftIcon: <Icon icon={'date-range'} /> }}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ------- Due date ------- */}
      <FastField name={'due_date'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'due_date'} />}
            inline={true}
            className={classNames(
              'form-group--due-date',
              'form-group--select-list',
              CLASSES.FILL,
            )}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="due_date" />}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={tansformDateValue(value)}
              onChange={handleDateChange((formattedDate) => {
                form.setFieldValue('due_date', formattedDate);
              })}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              inputProps={{
                leftIcon: <Icon icon={'date-range'} />,
              }}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ------- Bill number ------- */}
      <FastField name={'bill_number'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'bill_number'} />}
            inline={true}
            className={('form-group--bill_number', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="bill_number" />}
          >
            <InputGroup minimal={true} {...field} />
          </FormGroup>
        )}
      </FastField>

      {/* ------- Reference ------- */}
      <FastField name={'reference_no'}>
        {({ field, meta: { error, touched } }) => (
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
      <FFormGroup
        name={'project_id'}
        label={<T id={'bill.project_name.label'} />}
        inline={true}
        className={classNames('form-group--select-list', Classes.FILL)}
      >
        <ProjectsSelect
          name={'project_id'}
          projects={projects}
          input={BillProjectSelectButton}
          popoverFill={true}
        />
      </FFormGroup>
    </div>
  );
}

export default compose(withDialogActions)(BillFormHeader);

const VendorButtonLink = styled(VendorDrawerLink)`
  font-size: 11px;
  margin-top: 6px;
`;
