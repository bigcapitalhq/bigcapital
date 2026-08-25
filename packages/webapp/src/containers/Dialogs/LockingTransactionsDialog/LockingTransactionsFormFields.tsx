import { Classes, Position } from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import {
  FieldRequiredHint,
  FTextArea,
  FDateInput,
  FFormGroup,
} from '@/components';
import { CLASSES } from '@/constants/classes';
import { useAutofocus, useDateInputFormatter } from '@/hooks';

/**
 * Locking transactions form fields.
 */
export function LockingTransactionsFormFields(): React.ReactElement {
  const reasonFieldRef = useAutofocus<HTMLTextAreaElement>();
  const dateInputFormatter = useDateInputFormatter();

  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------  Locking Date ----------- */}
      <FFormGroup
        name={'lock_to_date'}
        label={intl.get('locking_transactions.dialog.locking_date')}
        labelInfo={<FieldRequiredHint />}
        className={classNames(CLASSES.FILL, 'form-group--date')}
        fastField
      >
        <FDateInput
          name={'lock_to_date'}
          {...dateInputFormatter}
          popoverProps={{
            position: Position.BOTTOM,
            minimal: true,
          }}
          fastField
        />
      </FFormGroup>

      {/*------------ Locking  Reason ----------- */}
      <FFormGroup
        name={'reason'}
        label={intl.get('locking_transactions.dialog.reason')}
        labelInfo={<FieldRequiredHint />}
        fastField
      >
        <FTextArea
          name={'reason'}
          growVertically={true}
          large={true}
          inputRef={(ref: HTMLTextAreaElement | null) => {
            reasonFieldRef.current = ref;
          }}
          fill
          fastField
        />
      </FFormGroup>
    </div>
  );
}
