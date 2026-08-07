import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { useRefundCreditNoteContext } from './RefundCreditNoteFormProvider';
import type { RefundCreditNoteFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

interface RefundCreditNoteFloatingActionsProps extends WithDialogActionsProps {}

/**
 * Refund credit note floating actions.
 */
function RefundCreditNoteFloatingActionsInner({
  closeDialog,
}: RefundCreditNoteFloatingActionsProps): React.ReactElement {
  // Formik context.
  const { isSubmitting } = useFormikContext<RefundCreditNoteFormValues>();

  // refund credit note dialog context.
  const { dialogName } = useRefundCreditNoteContext();

  // Handle close button click.
  const handleCancelBtnClick = () => {
    closeDialog(dialogName);
  };

  return (
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button onClick={handleCancelBtnClick} style={{ minWidth: '75px' }}>
          <T id={'cancel'} />
        </Button>
        <Button
          intent={Intent.PRIMARY}
          loading={isSubmitting}
          style={{ minWidth: '120px' }}
          type="submit"
          text={<T id={'refund'} />}
        />
      </div>
    </div>
  );
}
export const RefundCreditNoteFloatingActions = compose(withDialogActions)(
  RefundCreditNoteFloatingActionsInner,
);
