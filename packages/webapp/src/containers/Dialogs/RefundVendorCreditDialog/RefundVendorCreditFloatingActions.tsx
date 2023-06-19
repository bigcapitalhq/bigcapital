// @ts-nocheck
import React from 'react';
import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { FormattedMessage as T } from '@/components';

import { useRefundVendorCreditContext } from './RefundVendorCreditFormProvider';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

/**
 * Refund vendor floating actions.
 */
function RefundVendorCreditFloatingActions({
  // #withDialogActions
  closeDialog,
}) {
  // Formik context.
  const { isSubmitting } = useFormikContext();
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

export default compose(withDialogActions)(RefundVendorCreditFloatingActions);
