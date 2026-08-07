import { lazy } from 'react';
import { FormattedMessage as T } from '@/components';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const CustomerOpeningBalanceDialogContent = lazy(() =>
  import('./CustomerOpeningBalanceDialogContent').then((m) => ({
    default: m.CustomerOpeningBalanceDialogContent,
  })),
);

interface CustomerOpeningBalanceDialogProps extends DialogBaseProps {
  dialogName: string;
}

/**
 * Customer opening balance dialog.
 */
function CustomerOpeningBalanceDialog({
  dialogName,
  payload,
  isOpen,
}: CustomerOpeningBalanceDialogProps) {
  const customerId = (payload.customerId as number | undefined) ?? undefined;
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

export const index = compose(withDialogRedux())(CustomerOpeningBalanceDialog);
