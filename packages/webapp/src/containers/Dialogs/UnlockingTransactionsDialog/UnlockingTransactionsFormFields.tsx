import { Classes } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { FFormGroup, FTextArea } from '@/components';
import { useAutofocus } from '@/hooks';

/**
 * Unlocking transactions form fields.
 */
export function UnlockingTransactionsFormFields(): React.ReactElement {
  const reasonFieldRef = useAutofocus<HTMLTextAreaElement>();

  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Locking  Reason ----------- */}
      <FFormGroup
        name={'reason'}
        label={intl.get('unlocking_transactions.dialog.reason')}
      >
        <FTextArea
          name={'reason'}
          growVertically={true}
          large={true}
          inputRef={(ref: HTMLTextAreaElement | null) =>
            (reasonFieldRef.current = ref)
          }
        />
      </FFormGroup>
    </div>
  );
}
