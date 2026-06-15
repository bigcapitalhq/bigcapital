// @ts-nocheck
import React from 'react';

import { FormattedMessage as T } from '@/components';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { flow } from 'fp-ts/function';

const CustomerOpeningBalanceDialogContent = React.lazy(() =>
  import('./CustomerOpeningBalanceDialogContent').then((m) => ({
    default: m.CustomerOpeningBalanceDialogContent,
  })),
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
      className={'dialog--customer-opening-balance'}
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

export const index = flow(withDialogRedux())(
  CustomerOpeningBalanceDialog,
);
