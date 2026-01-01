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
import { useTheme } from '@emotion/react';
import { css } from '@emotion/css';

import { CLASSES } from '@/constants/classes';
import {
  FFormGroup,
  FieldRequiredHint,
  InputPrependButton,
  Icon,
  FormattedMessage as T,
  VendorDrawerLink,
  VendorsSelect,
  Stack,
  FDateInput,
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
  tansformDateValue,
  inputIntent,
  handleDateChange,
} from '@/utils';

import { withSettings } from '@/containers/Settings/withSettings';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';

const getFieldsStyle = (theme: Theme) => css`
  .${theme.bpPrefix}-form-group {
    margin-bottom: 0;

    &.${theme.bpPrefix}-inline {
      max-width: 500px;
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
  const theme = useTheme();
  const fieldsClassName = getFieldsStyle(theme);

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
    <Stack spacing={18} flex={1} className={fieldsClassName}>
      {/* ----------- Vendor name ----------- */}
      <VendorCreditFormVendorSelect />

      {/* ----------- Exchange rate ----------- */}
      <VendorCreditNoteExchangeRateInputField
        name={'exchange_rate'}
        formGroupProps={{ label: ' ', inline: true }}
      />

      {/* ------- Vendor Credit date ------- */}
      <FFormGroup
        name={'vendor_credit_date'}
        label={<T id={'credit_note.label_credit_note_date'} />}
        inline
        labelInfo={<FieldRequiredHint />}
        fill
        fastField
      >
        <FDateInput
          name={'vendor_credit_date'}
          {...momentFormatter('YYYY/MM/DD')}
          popoverProps={{ position: Position.BOTTOM_LEFT, minimal: true }}
          inputProps={{ leftIcon: <Icon icon={'date-range'} />, fill: true }}
          fill
          fastField
        />
      </FFormGroup>

      {/* ----------- Vendor Credit No # ----------- */}

      <FFormGroup
        name={'vendor_credit_number'}
        label={<T id={'credit_note.label_credit_note'} />}
        inline={true}
        labelInfo={<FieldRequiredHint />}
        fastField
      >
        <ControlGroup fill={true}>
          <FInputGroup
            name={'vendor_credit_number'}
            minimal={true}
            asyncControl={true}
            onBlur={handleVendorCreditNoBlur}
            fastField
          />
          <InputPrependButton
            buttonProps={{
              onClick: handleVendorCreditNumberChange,
              icon: <Icon icon={'settings-18'} />,
            }}
            tooltip={true}
            tooltipProps={{
              content: (
                <T id={'setting_your_auto_generated_vendor_credit_number'} />
              ),
              position: Position.BOTTOM_LEFT,
            }}
          />
        </ControlGroup>
      </FFormGroup>

      {/* ----------- Reference ----------- */}
      <FFormGroup label={<T id={'reference_no'} />} inline={true} fastField>
        <FInputGroup name={'reference_no'} minimal={true} fastField />
      </FFormGroup>
    </Stack>
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
