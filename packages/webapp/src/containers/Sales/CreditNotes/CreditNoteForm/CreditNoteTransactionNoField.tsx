// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { Position, ControlGroup } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import {
  FieldRequiredHint,
  InputPrependButton,
  Icon,
  FormattedMessage as T,
  FFormGroup,
  FInputGroup,
} from '@/components';
import withSettings from '@/containers/Settings/withSettings';
import withDialogActions from '@/containers/Dialog/withDialogActions';

/**
 * Credit note transaction number field.
 */
export const CreditNoteTransactionNoField = R.compose(
  withDialogActions,
  withSettings(({ creditNoteSettings }) => ({
    creditAutoIncrement: creditNoteSettings?.autoIncrement,
    creditNextNumber: creditNoteSettings?.nextNumber,
    creditNumberPrefix: creditNoteSettings?.numberPrefix,
  })),
)(
  ({
    // #withDialogActions
    openDialog,

    // #withSettings
    creditAutoIncrement,
  }) => {
    const { values, setFieldValue } = useFormikContext();

    // Handle credit number changing.
    const handleCreditNumberChange = () => {
      openDialog('credit-number-form');
    };
    // Handle credit note no. field blur.
    const handleCreditNoBlur = (event) => {
      const newValue = event.target.value;

      // Show the confirmation dialog if the value has changed and auto-increment
      // mode is enabled.
      if (values.credit_note_no !== newValue && creditAutoIncrement) {
        openDialog('credit-number-form', {
          initialFormValues: {
            onceManualNumber: newValue,
            incrementMode: 'manual-transaction',
          },
        });
      }
      // Setting the credit note number to the form will be manually in case
      // auto-increment is disable.
      if (!creditAutoIncrement) {
        setFieldValue('credit_note_number', newValue);
        setFieldValue('credit_note_number_manually', newValue);
      }
    };

    return (
      <FFormGroup
        name={'credit_note_number'}
        label={<T id={'credit_note.label_credit_note'} />}
        labelInfo={<FieldRequiredHint />}
        inline={true}
      >
        <ControlGroup fill={true}>
          <FInputGroup
            name={'credit_note_number'}
            minimal={true}
            value={values.credit_note_number}
            asyncControl={true}
            onBlur={handleCreditNoBlur}
            onChange={() => {}}
          />
          <InputPrependButton
            buttonProps={{
              onClick: handleCreditNumberChange,
              icon: <Icon icon={'settings-18'} />,
            }}
            tooltip={true}
            tooltipProps={{
              content: (
                <T id={'setting_your_auto_generated_credit_note_number'} />
              ),
              position: Position.BOTTOM_LEFT,
            }}
          />
        </ControlGroup>
      </FFormGroup>
    );
  },
);

CreditNoteTransactionNoField.displayName = 'CreditNoteTransactionNoField';
