// @ts-nocheck
import React from 'react';

import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const VendorOpeningBalanceDialogContent = React.lazy(
  () => import('./VendorOpeningBalanceDialogContent'),
);

/**
 * Vendor Opening balance dialog.
 * @returns
 */
function VendorOpeningBalanceDialog({
  dialogName,
  payload: { vendorId },
  isOpen,
}) {
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
export default compose(withDialogRedux())(VendorOpeningBalanceDialog);
