import React from 'react';

import { FormattedMessage as T } from '@/components';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from 'redux';

const VendorOpeningBalanceDialogContent = React.lazy(() =>
  import('./VendorOpeningBalanceDialogContent'),
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