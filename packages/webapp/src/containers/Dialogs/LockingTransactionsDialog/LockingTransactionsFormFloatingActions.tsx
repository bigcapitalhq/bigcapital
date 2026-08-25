import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { useLockingTransactionsContext } from './LockingTransactionsFormProvider';
import type { LockingTransactionsFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

interface LockingTransactionsFormFloatingActionsProps
  extends WithDialogActionsProps {}

/**
 * locking Transactions floating actions.
 */
function LockingTransactionsFormFloatingActionsInner({
  closeDialog,
}: LockingTransactionsFormFloatingActionsProps): React.ReactElement {
  // Formik context.
  const { isSubmitting } = useFormikContext<LockingTransactionsFormValues>();
  const { dialogName } = useLockingTransactionsContext();

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

export const LockingTransactionsFormFloatingActions = compose(
  withDialogActions,
)(LockingTransactionsFormFloatingActionsInner);
