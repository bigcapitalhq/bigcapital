import { Position, ControlGroup } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { useMakeJournalFormContext } from './MakeJournalProvider';
import type { MakeJournalFormValues } from './utils';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import {
  FieldHint,
  FieldRequiredHint,
  Icon,
  InputPrependButton,
  FormattedMessage as T,
  FInputGroup,
  FFormGroup,
} from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

interface MakeJournalTransactionNoFieldProps
  extends Pick<WithDialogActionsProps, 'openDialog'> {}

/**
 * Journal number field of make journal form.
 */
export const MakeJournalTransactionNoField = compose(withDialogActions)(({
  openDialog,
}: MakeJournalTransactionNoFieldProps) => {
  const { setFieldValue, values } = useFormikContext<MakeJournalFormValues>();
  const { manualJournalsSettings } = useMakeJournalFormContext();
  const journalAutoIncrement = manualJournalsSettings?.autoIncrement as
    | boolean
    | undefined;

  const handleJournalNumberChange = () => {
    openDialog('journal-number-form');
  };
  const handleJournalNoBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (values.journalNumber !== newValue && journalAutoIncrement) {
      openDialog('journal-number-form', {
        initialFormValues: {
          onceManualNumber: newValue,
          incrementMode: 'manual-transaction',
        },
      });
    }
    if (!journalAutoIncrement) {
      setFieldValue('journalNumber', newValue);
      setFieldValue('journalNumberManually', newValue);
    }
  };

  return (
    <FFormGroup
      name={'journalNumber'}
      label={intl.get('journal_no')}
      labelInfo={
        <>
          <FieldRequiredHint />
          <FieldHint />
        </>
      }
      inline={true}
      fastField={true}
    >
      <ControlGroup fill={true}>
        <FInputGroup
          name={'journalNumber'}
          fill={true}
          asyncControl={true}
          onBlur={handleJournalNoBlur}
          fastField={true}
          onChange={() => {}}
        />
        <InputPrependButton
          buttonProps={{
            onClick: handleJournalNumberChange,
            icon: <Icon icon={'settings-18'} />,
          }}
          tooltip={true}
          tooltipProps={{
            content: <T id={'setting_your_auto_generated_journal_number'} />,
            position: Position.BOTTOM_LEFT,
          }}
        />
      </ControlGroup>
    </FFormGroup>
  );
});

MakeJournalTransactionNoField.displayName = 'MakeJournalTransactionNoField';
