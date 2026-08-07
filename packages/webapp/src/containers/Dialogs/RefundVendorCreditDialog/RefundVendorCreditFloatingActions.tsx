import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { useRefundVendorCreditContext } from './RefundVendorCreditFormProvider';
import type { RefundVendorCreditFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

interface RefundVendorCreditFloatingActionsProps
  extends WithDialogActionsProps {}

/**
 * Refund vendor flaoting actions.
 */
function RefundVendorCreditFloatingActionsInner({
  closeDialog,
}: RefundVendorCreditFloatingActionsProps): React.ReactElement {
  // Formik context.
  const { isSubmitting } = useFormikContext<RefundVendorCreditFormValues>();
  // refund vendor credit  dialog context.
  const { dialogName } = useRefundVendorCreditContext();

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
        >
          <T id={'refund'} />
        </Button>
      </div>
    </div>
  );
}

export const RefundVendorCreditFloatingActions = compose(withDialogActions)(
  RefundVendorCreditFloatingActionsInner,
);
