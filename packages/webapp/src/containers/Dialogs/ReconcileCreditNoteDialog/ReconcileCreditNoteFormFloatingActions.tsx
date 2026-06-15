// @ts-nocheck
import React from 'react';
import { useFormikContext } from 'formik';
import { Intent, Button, Classes } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';

import { useReconcileCreditNoteContext } from './ReconcileCreditNoteFormProvider';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { flow } from 'fp-ts/function';

/**
 * Reconcile credit note floating actions.
 */
function ReconcileCreditNoteFormFloatingActionsInner({
  // #withDialogActions
  closeDialog,
}) {
  // Formik context.
  const { isSubmitting } = useFormikContext();

  const { dialogName } = useReconcileCreditNoteContext();

  // Handle cancel button click.
  const handleCancelBtnClick = (event) => {
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
          {<T id={'save'} />}
        </Button>
        <Button onClick={handleCancelBtnClick} style={{ minWidth: '85px' }}>
          <T id={'cancel'} />
        </Button>
      </div>
    </div>
  );
}
export const ReconcileCreditNoteFormFloatingActions = flow(
  withDialogActions,
)(ReconcileCreditNoteFormFloatingActionsInner);
