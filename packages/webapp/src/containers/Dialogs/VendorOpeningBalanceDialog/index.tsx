import { lazy } from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const VendorOpeningBalanceDialogContent = lazy(() =>
  import('./VendorOpeningBalanceDialogContent').then((m) => ({
    default: m.VendorOpeningBalanceDialogContent,
  })),
);

interface VendorOpeningBalanceDialogProps extends DialogBaseProps {
  dialogName: string;
}

/**
 * Vendor Opening balance dialog.
 */
function VendorOpeningBalanceDialog({
  dialogName,
  payload,
  isOpen,
}: VendorOpeningBalanceDialogProps) {
  const vendorId = (payload.vendorId as number | undefined) ?? undefined;
  return (
    <Dialog
      name={dialogName}
      title={<T id={'vendor_opening_balance.label'} />}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--vendor-opening-balance'}
    >
      <DialogSuspense>
        <VendorOpeningBalanceDialogContent
          vendorId={vendorId}
          dialogName={dialogName}
        />
      </DialogSuspense>
    </Dialog>
  );
}
export const index = compose(withDialogRedux())(VendorOpeningBalanceDialog);
