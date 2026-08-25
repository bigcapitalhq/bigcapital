import { Position, ControlGroup } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { Theme, useTheme } from '@emotion/react';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { VendorCreditNoteExchangeRateInputField } from './components';
import {
  vendorsFieldShouldUpdate,
  useObserveVendorCreditNoSettings,
  type VendorCreditFormValues,
} from './utils';
import { useVendorCreditNoteFormContext } from './VendorCreditNoteFormProvider';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
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
  FInputGroup,
} from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useDateInputFormatter } from '@/hooks';
import { compose } from '@/utils';

const getFieldsStyle = (theme: Theme & { bpPrefix?: string }) => css`
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

interface VendorCreditNoteFormHeaderFieldsInnerProps
  extends Pick<WithDialogActionsProps, 'openDialog'> {}

/**
 * Vendor Credit note form header fields.
 */
function VendorCreditNoteFormHeaderFieldsInner({
  openDialog,
}: VendorCreditNoteFormHeaderFieldsInnerProps) {
  const theme = useTheme();
  const fieldsClassName = getFieldsStyle(theme);
  const dateInputFormatter = useDateInputFormatter();
  const { values } = useFormikContext<VendorCreditFormValues>();
  const { vendorCreditSettings } = useVendorCreditNoteFormContext();
  const vendorcreditAutoIncrement = vendorCreditSettings?.autoIncrement as
    | boolean
    | undefined;
  const vendorcreditNextNumber = vendorCreditSettings?.nextNumber as
    | number
    | undefined;
  const vendorcreditNumberPrefix = vendorCreditSettings?.numberPrefix as
    | string
    | undefined;

  // Handle vendor credit number changing.
  const handleVendorCreditNumberChange = () => {
    openDialog('vendor-credit-form');
  };

  // Handle vendor credit no. field blur.
  const handleVendorCreditNoBlur: React.FocusEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const newValue = event.target.value;
    const oldValue = values.vendorCreditNumber;

    if (oldValue !== newValue && vendorcreditAutoIncrement) {
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
        name={'exchangeRate'}
        formGroupProps={{ label: ' ', inline: true }}
      />
      {/* ------- Vendor Credit date ------- */}
      <FFormGroup
        name={'vendorCreditDate'}
        label={intl.get('credit_note.label_credit_note_date')}
        inline
        labelInfo={<FieldRequiredHint />}
        fastField
      >
        <FDateInput
          name={'vendorCreditDate'}
          {...dateInputFormatter}
          popoverProps={{ position: Position.BOTTOM_LEFT, minimal: true }}
          inputProps={{ leftIcon: <Icon icon={'date-range'} />, fill: true }}
          fill
          fastField
        />
      </FFormGroup>

      {/* ----------- Vendor Credit No # ----------- */}
      <FFormGroup
        name={'vendorCreditNumber'}
        label={intl.get('credit_note.label_credit_note')}
        inline={true}
        labelInfo={<FieldRequiredHint />}
        fastField
      >
        <ControlGroup fill={true}>
          <FInputGroup
            name={'vendorCreditNumber'}
            asyncControl={true}
            onBlur={handleVendorCreditNoBlur}
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
      <FFormGroup
        name={'referenceNo'}
        label={intl.get('reference_no')}
        inline={true}
        fastField
      >
        <FInputGroup name={'referenceNo'} />
      </FFormGroup>
    </Stack>
  );
}

type VendorOption = { id: number; currencyCode: string };

/**
 * Vendor select field of vendor credit form.
 */
function VendorCreditFormVendorSelect() {
  const { values, setFieldValue } = useFormikContext<VendorCreditFormValues>();

  // Vendor Credit form context.
  const { vendors } = useVendorCreditNoteFormContext();

  return (
    <FFormGroup
      name={'vendorId'}
      label={intl.get('vendor_name')}
      inline={true}
      labelInfo={<FieldRequiredHint />}
      fastField={true}
    >
      <>
        <VendorsSelect
          name={'vendorId'}
          items={vendors}
          placeholder={<T id={'select_vender_account'} />}
          onItemChange={(contact: VendorOption) => {
            setFieldValue('vendorId', contact.id);
            setFieldValue('currencyCode', contact?.currencyCode);
          }}
          popoverFill={true}
          allowCreate={true}
          fastField={true}
          shouldUpdate={vendorsFieldShouldUpdate}
          shouldUpdateDeps={{ items: vendors }}
        />
        {values.vendorId && (
          <VendorButtonLink vendorId={Number(values.vendorId)}>
            <T id={'view_vendor_details'} />
          </VendorButtonLink>
        )}
      </>
    </FFormGroup>
  );
}

export const VendorCreditNoteFormHeaderFields = compose(withDialogActions)(
  VendorCreditNoteFormHeaderFieldsInner,
);

const VendorButtonLink = styled(VendorDrawerLink)`
  font-size: 11px;
  margin-top: 6px;
`;
