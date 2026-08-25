import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { useUnlockingTransactionsContext } from './UnlockingTransactionsFormProvider';
import type { UnlockingTransactionsFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

interface UnlockingTransactionsFormFloatingActionsProps
  extends WithDialogActionsProps {}

/**
 * Unlocking transactions form floating actions.
 */
function UnlockingTransactionsFormFloatingActionsInner({
  closeDialog,
}: UnlockingTransactionsFormFloatingActionsProps): React.ReactElement {
  // Formik context.
  const { isSubmitting } = useFormikContext<UnlockingTransactionsFormValues>();

  const { dialogName } = useUnlockingTransactionsContext();

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

export const UnlockingTransactionsFormFloatingActions = compose(
  withDialogActions,
)(UnlockingTransactionsFormFloatingActionsInner);
