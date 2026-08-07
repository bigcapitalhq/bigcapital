import { Position, ControlGroup } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import type { CreditNoteFormValues } from './utils';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import {
  FieldRequiredHint,
  InputPrependButton,
  Icon,
  FormattedMessage as T,
  FFormGroup,
  FInputGroup,
} from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';
import { useCreditNoteFormContext } from './CreditNoteFormProvider';

interface CreditNoteTransactionNoFieldProps
  extends Pick<WithDialogActionsProps, 'openDialog'> {}

/**
 * Credit note transaction number field.
 */
const CreditNoteTransactionNoFieldInner = ({
  openDialog,
}: CreditNoteTransactionNoFieldProps) => {
  const { values, setFieldValue } = useFormikContext<CreditNoteFormValues>();
  const { creditNoteSettings } = useCreditNoteFormContext();
  const creditAutoIncrement = creditNoteSettings?.autoIncrement as
    | boolean
    | undefined;

  // Handle credit number changing.
  const handleCreditNumberChange = () => {
    openDialog('credit-number-form');
  };
  // Handle credit note no. field blur.
  const handleCreditNoBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    // Show the confirmation dialog if the value has changed and auto-increment
    // mode is enabled.
    if (values.creditNoteNumber !== newValue && creditAutoIncrement) {
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
      setFieldValue('creditNoteNumber', newValue);
      setFieldValue('creditNoteNumberManually', newValue);
    }
  };

  return (
    <FFormGroup
      name={'creditNoteNumber'}
      label={intl.get('credit_note.label_credit_note')}
      labelInfo={<FieldRequiredHint />}
      inline={true}
    >
      <ControlGroup fill={true}>
        <FInputGroup
          name={'creditNoteNumber'}
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
};

export const CreditNoteTransactionNoField = compose(withDialogActions)(
  CreditNoteTransactionNoFieldInner,
);

CreditNoteTransactionNoField.displayName = 'CreditNoteTransactionNoField';
