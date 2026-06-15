// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from 'redux';
import { flow } from 'fp-ts/function';

const MoneyOutDialogContent = React.lazy(() =>
  import('./MoneyOutDialogContent').then((m) => ({
    default: m.MoneyOutDialogContent,
  })),
);

/**
 * Money out dialog.
 */
function MoneyOutDialog({
  dialogName,
  payload = { account_type: null, account_id: null, account_name: '' },

  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={intl.get('cash_flow_transaction.money_out', {
        value: payload.account_name,
      })}
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

export const index = flow(withDialogRedux())(MoneyOutDialog);
