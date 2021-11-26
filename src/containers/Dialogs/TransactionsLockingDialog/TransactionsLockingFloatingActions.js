import React from 'react';
import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { FormattedMessage as T } from 'components';

import { useTransactionLockingContext } from './TransactionsLockingFormProvider';
import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';

/**
 * Transactions locking floating actions.
 */
function TransactionsLockingFloatingActions({
  // #withDialogActions
  closeDialog,
}) {
  // Formik context.
  const { isSubmitting } = useFormikContext();

  const { dialogName } = useTransactionLockingContext();

  // Handle cancel button click.
  const handleCancelBtnClick = (event) => {
    closeDialog(dialogName);
  };

  return (
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button
          disabled={isSubmitting}
          onClick={handleCancelBtnClick}
          style={{ minWidth: '75px' }}
        >
          <T id={'cancel'} />
        </Button>
        <Button
          intent={Intent.PRIMARY}
          loading={isSubmitting}
          style={{ minWidth: '75px' }}
          type="submit"
        >
          {<T id={'submit'} />}
        </Button>
      </div>
    </div>
  );
}

export default compose(withDialogActions)(TransactionsLockingFloatingActions);
