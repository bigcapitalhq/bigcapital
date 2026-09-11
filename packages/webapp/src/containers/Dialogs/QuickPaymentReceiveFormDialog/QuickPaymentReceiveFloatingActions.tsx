import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import * as FF from 'fp-ts/function';
import React from 'react';
import { useQuickPaymentReceiveContext } from './QuickPaymentReceiveFormProvider';
import type { QuickPaymentReceiveFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';

interface QuickPaymentReceiveFloatingActionsProps
  extends WithDialogActionsProps {}

function QuickPaymentReceiveFloatingActionsInner({
  closeDialog,
}: QuickPaymentReceiveFloatingActionsProps) {
  // Formik context.
  const { isSubmitting } = useFormikContext<QuickPaymentReceiveFormValues>();

  // quick payment receive dialog context.
  const { dialogName } = useQuickPaymentReceiveContext();

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
          style={{ minWidth: '75px' }}
          type="submit"
        >
          {<T id={'make_payment'} />}
        </Button>
      </div>
    </div>
  );
}
export const QuickPaymentReceiveFloatingActions = FF.pipe(
  QuickPaymentReceiveFloatingActionsInner,
  withDialogActions,
);
