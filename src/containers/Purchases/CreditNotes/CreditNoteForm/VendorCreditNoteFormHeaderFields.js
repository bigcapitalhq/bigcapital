import React from 'react';
import {
  FormGroup,
  InputGroup,
  Position,
  ControlGroup,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FastField, Field, ErrorMessage } from 'formik';
import { CLASSES } from 'common/classes';
import classNames from 'classnames';
import {
  ContactSelecetList,
  FieldRequiredHint,
  InputPrependButton,
  Icon,
  FormattedMessage as T,
} from 'components';
import {
  vendorsFieldShouldUpdate,
  useObserveVendorCreditNoSettings,
} from './utils';

import { useVendorCreditNoteFormContext } from './VendorCreditNoteFormProvider';

import {
  momentFormatter,
  compose,
  tansformDateValue,
  inputIntent,
  handleDateChange,
} from 'utils';

import withSettings from 'containers/Settings/withSettings';
import withDialogActions from 'containers/Dialog/withDialogActions';

/**
 * Vendor Credit note form header fields.
 */
function VendorCreditNoteFormHeaderFields({
  // #withDialogActions
  openDialog,

  // #withSettings
  vendorcreditAutoIncrement,
  vendorcreditNumberPrefix,
  vendorcreditNextNumber,
}) {
  // Vendor Credit form context.
  const { vendors } = useVendorCreditNoteFormContext();

  // Handle vendor credit number changing.
  const handleVendorCreditNumberChange = () => {
    openDialog('vendor-credit-form');
  };

  // Handle vendor credit no. field blur.
  const handleVendorCreditNoBlur = (form, field) => (event) => {
    const newValue = event.target.value;

    if (field.value !== newValue && vendorcreditAutoIncrement) {
      openDialog('vendor-credit-form', {
        initialFormValues: {
          manualTransactionNo: newValue,
          incrementMode: 'manual-transaction',
        },
      });
    }
  };
  // Syncs vendor credit number settings with form.
  useObserveVendorCreditNoSettings(
    vendorcreditNumberPrefix,
    vendorcreditNextNumber,
  );

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_FIELDS)}>
      {/* ----------- Vendor name ----------- */}
      <FastField
        name={'vendor_id'}
        customers={vendors}
        shouldUpdate={vendorsFieldShouldUpdate}
      >
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'vendor_name'} />}
            inline={true}
            className={classNames(
              'form-group--vendor-name',
              'form-group--select-list',
              CLASSES.FILL,
            )}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'vendor_id'} />}
          >
            <ContactSelecetList
              contactsList={vendors}
              selectedContactId={value}
              defaultSelectText={<T id={'select_vender_account'} />}
              onContactSelected={(vendor) => {
                form.setFieldValue('vendor_id', vendor.id);
              }}
              popoverFill={true}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ------- Vendor Credit date ------- */}
      <FastField name={'vendor_credit_date'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'credit_note.label_credit_note_date'} />}
            inline={true}
            labelInfo={<FieldRequiredHint />}
            className={classNames(
              'form-group--vendor_credit_date',
              CLASSES.FILL,
            )}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="vendor_credit_date" />}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={tansformDateValue(value)}
              onChange={handleDateChange((formattedDate) => {
                form.setFieldValue('vendor_credit_date', formattedDate);
              })}
              popoverProps={{ position: Position.BOTTOM_LEFT, minimal: true }}
              inputProps={{
                leftIcon: <Icon icon={'date-range'} />,
              }}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Vendor Credit No # ----------- */}
      <FastField name={'vendor_credit_number'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'credit_note.label_credit_note'} />}
            inline={true}
            className={('form-group--vendor_credit_number', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="vendor_credit_number" />}
          >
            <ControlGroup fill={true}>
              <InputGroup
                minimal={true}
                value={field.value}
                asyncControl={true}
                onBlur={handleVendorCreditNoBlur(form, field)}
              />
              <InputPrependButton
                buttonProps={{
                  onClick: handleVendorCreditNumberChange,
                  icon: <Icon icon={'settings-18'} />,
                }}
                tooltip={true}
                tooltipProps={{
                  content: (
                    <T
                      id={'setting_your_auto_generated_vendor_credit_number'}
                    />
                  ),
                  position: Position.BOTTOM_LEFT,
                }}
              />
            </ControlGroup>
          </FormGroup>
        )}
      </FastField>
      {/* ----------- Reference ----------- */}
      <FastField name={'reference_no'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'reference_no'} />}
            inline={true}
            className={classNames('form-group--reference', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="reference_no" />}
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
  withSettings(({ vendorsCreditNoteSetting }) => ({
    vendorcreditAutoIncrement: vendorsCreditNoteSetting?.autoIncrement,
    vendorcreditNextNumber: vendorsCreditNoteSetting?.nextNumber,
    vendorcreditNumberPrefix: vendorsCreditNoteSetting?.numberPrefix,
  })),
)(VendorCreditNoteFormHeaderFields);
