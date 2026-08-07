import { Button, Classes, Intent } from '@blueprintjs/core';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

type InvoiceExchangeRateChangeDialogInnerProps = {
  dialogName: string;
  isOpen: boolean;
  closeDialog: (name: string) => void;
};

/**
 * Invoice number dialog.
 */
function InvoiceExchangeRateChangeDialogInner({
  dialogName,
  isOpen,
  // #withDialogActions
  closeDialog,
}: InvoiceExchangeRateChangeDialogInnerProps) {
  const handleConfirm = () => {
    closeDialog(dialogName);
  };

  return (
    <Dialog
      name={dialogName}
      title={'Kindly take care of new rates'}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      onClose={() => {}}
    >
      <DialogSuspense>
        <div className={Classes.DIALOG_BODY}>
          <p>
            The item rates have been <strong>adjusted</strong> to the new
            currency using realtime exchange rate.
          </p>

          <p style={{ marginBottom: '30px' }}>
            Make sure to check that the item rates match the current exchange
            rate of the newly selected currency before saving the transaction.
          </p>
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <Button onClick={handleConfirm} intent={Intent.PRIMARY} fill>
            Ok
          </Button>
        </div>
      </DialogSuspense>
    </Dialog>
  );
}

export const InvoiceExchangeRateChangeDialog = compose(
  withDialogRedux(),
  withDialogActions,
)(InvoiceExchangeRateChangeDialogInner);
