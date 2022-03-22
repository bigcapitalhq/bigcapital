import React from 'react';

import { FormattedMessage as T } from 'components';
import { Dialog, DialogSuspense } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';
import { compose } from 'redux';

const CustomerOpeningBalanceDialogContent = React.lazy(() =>
  import('./CustomerOpeningBalanceDialogContent'),
);

/**
 * Customer opening balance dialog.
 * @returns
 */
function CustomerOpeningBalanceDialog({
  dialogName,
  payload: { customerId },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'customer_opening_balance.label'} />}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      style={{ maxWidth: '400px' }}
    >
      <DialogSuspense>
        <CustomerOpeningBalanceDialogContent
          customerId={customerId}
          dialogName={dialogName}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(CustomerOpeningBalanceDialog);
