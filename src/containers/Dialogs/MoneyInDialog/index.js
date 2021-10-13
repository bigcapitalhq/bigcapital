import React from 'react';
import { FormattedMessage as T } from 'components';
import { Dialog, DialogSuspense } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';
import { compose } from 'redux';

const MoneyInDialogContent = React.lazy(() => import('./MoneyInDialogContent'));

/**
 * Money In dialog.
 */
function MoneyInDialog({
  dialogName,
  payload = { action: '', account_type: null, account_id: null },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'cash_flow_transaction.money_in'} />}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--money-in'}
    >
      <DialogSuspense>
        <MoneyInDialogContent
          dialogName={dialogName}
          accountId={payload.account_id}
          accountType={payload.account_type}
        />
      </DialogSuspense>
    </Dialog>
  );
}
export default compose(withDialogRedux())(MoneyInDialog);
