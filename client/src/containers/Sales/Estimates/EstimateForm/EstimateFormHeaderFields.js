import React from 'react';
import {
  FormGroup,
  InputGroup,
  Position,
  ControlGroup,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FormattedMessage as T } from 'components';
import { FastField, ErrorMessage } from 'formik';
import {
  momentFormatter,
  compose,
  tansformDateValue,
  inputIntent,
  handleDateChange,
} from 'utils';
import { customersFieldShouldUpdate } from './utils';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import {
  ContactSelecetList,
  FieldRequiredHint,
  Icon,
  InputPrependButton,
} from 'components';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withSettings from 'containers/Settings/withSettings';

import { useObserveEstimateNoSettings } from './utils';
import { useEstimateFormContext } from './EstimateFormProvider';

/**
 * Estimate form header.
 */
function EstimateFormHeader({
  // #withDialogActions
  openDialog,

  // #withSettings
  estimateAutoIncrement,
  estimateNumberPrefix,
  estimateNextNumber,
}) {
  const { customers } = useEstimateFormContext();

  const handleEstimateNumberBtnClick = () => {
    openDialog('estimate-number-form', {});
  };

  const handleEstimateNoBlur = (form, field) => (event) => {
    const newValue = event.target.value;

    if (field.value !== newValue && estimateAutoIncrement) {
      openDialog('estimate-number-form', {
        initialFormValues: {
          manualTransactionNo: newValue,
          incrementMode: 'manual-transaction',
        },
      });
    }
  };

  // Syncs estimate number settings with the form.
  useObserveEstimateNoSettings(estimateNumberPrefix, estimateNextNumber);

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
            <ContactSelecetList
              contactsList={customers}
              selectedContactId={value}
              defaultSelectText={<T id={'select_customer_account'} />}
              onContactSelected={(customer) => {
                form.setFieldValue('customer_id', customer.id);
              }}
              popoverFill={true}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Estimate date ----------- */}
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
      <FastField name={'estimate_number'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'estimate'} />}
            inline={true}
            className={('form-group--estimate-number', CLASSES.FILL)}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="estimate_number" />}
          >
            <ControlGroup fill={true}>
              <InputGroup
                minimal={true}
                value={field.value}
                asyncControl={true}
                onBlur={handleEstimateNoBlur(form, field)}
              />
              <InputPrependButton
                buttonProps={{
                  onClick: handleEstimateNumberBtnClick,
                  icon: <Icon icon={'settings-18'} />,
                }}
                tooltip={true}
                tooltipProps={{
                  content: (
                    <T id={'setting_your_auto_generated_estimate_number'} />
                  ),
                  position: Position.BOTTOM_LEFT,
                }}
              />
            </ControlGroup>
          </FormGroup>
        )}
      </FastField>

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
    </div>
  );
}

export default compose(
  withDialogActions,
  withSettings(({ estimatesSettings }) => ({
    estimateNextNumber: estimatesSettings?.nextNumber,
    estimateNumberPrefix: estimatesSettings?.numberPrefix,
    estimateAutoIncrement: estimatesSettings?.autoIncrement,
  })),
)(EstimateFormHeader);
