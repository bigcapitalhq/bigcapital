import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { useQuickPaymentReceiveContext } from './QuickPaymentReceiveFormProvider';
import type { QuickPaymentReceiveFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

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
export const QuickPaymentReceiveFloatingActions = compose(withDialogActions)(
  QuickPaymentReceiveFloatingActionsInner,
);
