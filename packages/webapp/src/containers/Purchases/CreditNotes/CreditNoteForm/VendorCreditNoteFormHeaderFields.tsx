// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import {
  FormGroup,
  InputGroup,
  Position,
  ControlGroup,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FastField, ErrorMessage, useFormikContext } from 'formik';
import { CLASSES } from '@/constants/classes';

import {
  FFormGroup,
  FieldRequiredHint,
  InputPrependButton,
  Icon,
  FormattedMessage as T,
  VendorDrawerLink,
  VendorsSelect,
} from '@/components';
import {
  vendorsFieldShouldUpdate,
  useObserveVendorCreditNoSettings,
} from './utils';

import { useVendorCreditNoteFormContext } from './VendorCreditNoteFormProvider';
import { VendorCreditNoteExchangeRateInputField } from './components';
import {
  momentFormatter,
  compose,
  transformDateValue,
  inputIntent,
  handleDateChange,
} from '@/utils';

import withSettings from '@/containers/Settings/withSettings';
import withDialogActions from '@/containers/Dialog/withDialogActions';

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
      <VendorCreditFormVendorSelect />

      {/* ----------- Exchange rate ----------- */}
      <VendorCreditNoteExchangeRateInputField
        name={'exchange_rate'}
        formGroupProps={{ label: ' ', inline: true }}
      />

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
              value={transformDateValue(value)}
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
            labelInfo={<FieldRequiredHint />}
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

/**
 * Vendor select field of vendor credit form.
 * @returns {React.ReactNode}
 */
function VendorCreditFormVendorSelect() {
  const { values, setFieldValue } = useFormikContext();

  // Vendor Credit form context.
  const { vendors } = useVendorCreditNoteFormContext();

  return (
    <FFormGroup
      name={'vendor_id'}
      label={<T id={'vendor_name'} />}
      inline={true}
      labelInfo={<FieldRequiredHint />}
      fastField={true}
      shouldUpdate={vendorsFieldShouldUpdate}
      shouldUpdateDeps={{ items: vendors }}
    >
      <VendorsSelect
        name={'vendor_id'}
        items={vendors}
        placeholder={<T id={'select_vender_account'} />}
        onItemChange={(contact) => {
          setFieldValue('vendor_id', contact.id);
          setFieldValue('currency_code', contact?.currency_code);
        }}
        popoverFill={true}
        allowCreate={true}
        fastField={true}
        shouldUpdate={vendorsFieldShouldUpdate}
        shouldUpdateDeps={{ items: vendors }}
      />
      {values.vendor_id && (
        <VendorButtonLink vendorId={values.vendor_id}>
          <T id={'view_vendor_details'} />
        </VendorButtonLink>
      )}
    </FFormGroup>
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

const VendorButtonLink = styled(VendorDrawerLink)`
  font-size: 11px;
  margin-top: 6px;
`;
