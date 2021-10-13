import React from 'react';
import { FormattedMessage as T } from 'components';
import { Dialog, DialogSuspense } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';
import { compose } from 'redux';

const MoneyOutDialogContent = React.lazy(() =>
  import('./MoneyOutDialogContent'),
);

/**
 * Money out dialog.
 */
function MoneyOutDialog({
  dialogName,
  payload = { action: '', account_type: null, account_id: null },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'cash_flow_transaction.money_out'} />}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--money-out'}
    >
      <DialogSuspense>
        <MoneyOutDialogContent
          dialogName={dialogName}
          accountId={payload.account_id}
          accountType={payload.account_type}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(MoneyOutDialog);
