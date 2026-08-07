import React from 'react';
import intl from 'react-intl-universal';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const MoneyInDialogContent = React.lazy(() =>
  import('./MoneyInDialogContent').then((m) => ({
    default: m.MoneyInDialogContent,
  })),
);

interface MoneyInDialogProps extends DialogBaseProps {
  dialogName: string;
}

interface DialogPayload {
  account_type?: string | null;
  account_id?: number | null;
  account_name?: string;
}

/**
 * Money In dialog.
 */
function MoneyInDialog({
  dialogName,
  payload = { account_type: null, account_id: null, account_name: '' },
  isOpen,
}: MoneyInDialogProps) {
  const typedPayload = payload as DialogPayload;
  return (
    <Dialog
      name={dialogName}
      title={intl.get('cash_flow_transaction.money_in', {
        value: typedPayload.account_name,
      })}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--money-in'}
    >
      <DialogSuspense>
        <MoneyInDialogContent
          dialogName={dialogName}
          accountId={typedPayload.account_id}
          accountType={typedPayload.account_type}
        />
      </DialogSuspense>
    </Dialog>
  );
}
export const index = compose(withDialogRedux())(MoneyInDialog);
