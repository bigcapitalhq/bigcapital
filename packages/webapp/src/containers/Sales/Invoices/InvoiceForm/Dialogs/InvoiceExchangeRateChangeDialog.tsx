// @ts-nocheck
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';
import { Button, Classes, Intent } from '@blueprintjs/core';

/**
 * Invoice number dialog.
 */
function InvoiceExchangeRateChangeDialog({
  dialogName,
  payload: { initialFormValues },
  isOpen,
  onConfirm,
  // #withDialogActions
  closeDialog,
}) {
  const handleConfirm = () => {
    closeDialog(dialogName);
  };

  return (
    <Dialog
      title={'Please take care of the following'}
      name={dialogName}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      onClose={() => {}}
    >
      <DialogSuspense>
        <div className={Classes.DIALOG_BODY}>
          <p>
            You have changed customers's currency after adding items to the
            Invoice.
          </p>

          <p>
            The item rates have been adjusted to the new currency using exchange
            rate feeds.
          </p>

          <p>
            Before saving the transaction, ensure that the item rates align with
            the current exchange rate of the newly selected currency.
          </p>
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <Button onClick={handleConfirm} intent={Intent.PRIMARY}>
            Ok
          </Button>
        </div>
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(
  withDialogRedux(),
  withDialogActions,
)(InvoiceExchangeRateChangeDialog);
