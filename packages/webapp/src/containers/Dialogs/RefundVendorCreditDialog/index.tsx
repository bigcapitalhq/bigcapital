import React from 'react';
import type { RefundVendorCreditDialogPayload } from './types';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const RefundVendorCreditDialogContent = React.lazy(() =>
  import('./RefundVendorCreditDialogContent').then((m) => ({
    default: m.RefundVendorCreditDialogContent,
  })),
);

interface RefundVendorCreditDialogProps {
  dialogName: string;
  payload: RefundVendorCreditDialogPayload;
  isOpen: boolean | undefined;
}

/**
 * Refund vendor credit dialog.
 */
function RefundVendorCreditDialog({
  dialogName,
  payload: { vendorCreditId } = {},
  isOpen,
}: RefundVendorCreditDialogProps): React.ReactElement {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'refund_vendor_credit.dialog.label'} />}
      isOpen={isOpen}
      // FIXME: typo — should be `canEscapeKeyClose`. Left as-is to avoid a
      // behavior change in a TS-only slice.
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--refund-vendor-credit'}
    >
      <DialogSuspense>
        <RefundVendorCreditDialogContent
          dialogName={dialogName}
          vendorCreditId={vendorCreditId ?? null}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = compose(withDialogRedux())(RefundVendorCreditDialog);
