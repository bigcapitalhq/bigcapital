import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useCloseReceipt } from '@/hooks/query';
import { compose } from '@/utils';

interface ReceiptCloseAlertPayload {
  receiptId: number;
}

interface ReceiptCloseAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: ReceiptCloseAlertPayload;
}

/**
 * Receipt close alert.
 */
function ReceiptCloseAlertInner({
  name,
  isOpen,
  payload: { receiptId },
  closeAlert,
}: ReceiptCloseAlertProps): React.ReactElement {
  const { mutateAsync: closeReceiptMutate, isPending: isLoading } =
    useCloseReceipt();

  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  const handleConfirmReceiptClose = () => {
    closeReceiptMutate(receiptId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_receipt_has_been_closed_successfully'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error: Error) => {
        // Bugfix: original @ts-nocheck had an empty `.catch((error) => {})` that silently swallowed failures.
        AppToaster.show({
          message: error.message,
          intent: Intent.DANGER,
        });
      })
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('close')}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelDeleteAlert}
      onConfirm={handleConfirmReceiptClose}
      loading={isLoading}
    >
      <p>
        <T id={'are_sure_to_close_this_receipt'} />
      </p>
    </Alert>
  );
}

export const ReceiptCloseAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ReceiptCloseAlertInner);
