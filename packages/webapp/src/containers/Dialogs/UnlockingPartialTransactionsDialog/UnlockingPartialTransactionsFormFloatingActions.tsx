import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import * as FF from 'fp-ts/function';
import React from 'react';
import { useUnlockingPartialTransactionsContext } from './UnlockingPartialTransactionsFormProvider';
import type { UnlockingPartialTransactionsFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';

interface UnlockingPartialTransactionsFormFloatingActionsProps
  extends WithDialogActionsProps {}

/**
 * Partial Unlocking transactions floating actions
 */
function UnlockingPartialTransactionsFormFloatingActionsInner({
  closeDialog,
}: UnlockingPartialTransactionsFormFloatingActionsProps): React.ReactElement {
  // Formik context.
  const { isSubmitting } =
    useFormikContext<UnlockingPartialTransactionsFormValues>();

  const { dialogName } = useUnlockingPartialTransactionsContext();

  // Handle cancel button click.
  const handleCancelBtnClick = () => {
    closeDialog(dialogName);
  };

  return (
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button
          intent={Intent.PRIMARY}
          style={{ minWidth: '95px' }}
          type="submit"
          loading={isSubmitting}
        >
          <T id={'save'} />
        </Button>

        <Button onClick={handleCancelBtnClick} style={{ minWidth: '85px' }}>
          <T id={'cancel'} />
        </Button>
      </div>
    </div>
  );
}

export const UnlockingPartialTransactionsFormFloatingActions = FF.pipe(
  UnlockingPartialTransactionsFormFloatingActionsInner,
  withDialogActions,
);
