// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';

import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const RefundVendorCreditDialogContent = React.lazy(() =>
  import('./RefundVendorCreditDialogContent'),
);

/**
 * Refund vendor credit dialog.
 */
function RefundVendorCreditDialog({
  dialogName,
  payload: { vendorCreditId },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'refund_vendor_credit.dialog.label'} />}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--refund-vendor-credit'}
    >
      <DialogSuspense>
        <RefundVendorCreditDialogContent
          dialogName={dialogName}
          vendorCreditId={vendorCreditId}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(RefundVendorCreditDialog);
