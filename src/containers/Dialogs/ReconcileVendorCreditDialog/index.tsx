// @ts-nocheck
import React from 'react';
import { FormattedMessage as T, Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const ReconcileVendorCreditDialogContent = React.lazy(() =>
  import('./ReconcileVendorCreditDialogContent'),
);

/**
 * Reconcile vendor credit dialog.
 */
function ReconcileVendorCreditDialog({
  dialogName,
  payload: { vendorCreditId },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'reconcile_vendor_credit.dialog.label'} />}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      className="dialog--reconcile-vendor-credit-form"
    >
      <DialogSuspense>
        <ReconcileVendorCreditDialogContent
          vendorCreditId={vendorCreditId}
          dialogName={dialogName}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(ReconcileVendorCreditDialog);
