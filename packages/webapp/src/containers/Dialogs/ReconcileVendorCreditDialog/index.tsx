import React from 'react';
import type { ReconcileVendorCreditDialogPayload } from './types';
import { FormattedMessage as T, Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const ReconcileVendorCreditDialogContent = React.lazy(() =>
  import('./ReconcileVendorCreditDialogContent').then((m) => ({
    default: m.ReconcileVendorCreditDialogContent,
  })),
);

interface ReconcileVendorCreditDialogProps {
  dialogName: string;
  payload: ReconcileVendorCreditDialogPayload;
  isOpen: boolean | undefined;
}

/**
 * Reconcile vendor credit dialog.
 */
function ReconcileVendorCreditDialog({
  dialogName,
  payload: { vendorCreditId } = {},
  isOpen,
}: ReconcileVendorCreditDialogProps): React.ReactElement {
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
          vendorCreditId={vendorCreditId ?? null}
          dialogName={dialogName}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = compose(withDialogRedux())(ReconcileVendorCreditDialog);
