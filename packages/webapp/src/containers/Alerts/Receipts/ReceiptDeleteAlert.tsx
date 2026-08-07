import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedHTMLMessage } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { useDeleteReceipt } from '@/hooks/query';
import { compose } from '@/utils';

interface ReceiptDeleteAlertPayload {
  receiptId: number;
}

interface ReceiptDeleteAlertProps
  extends WithAlertActionsProps,
    WithDrawerActionsProps {
  name: string;
  isOpen: boolean;
  payload: ReceiptDeleteAlertPayload;
}

/**
 * Receipt delete alert.
 */
function NameDeleteAlert({
  name,
  isOpen,
  payload: { receiptId },
  closeAlert,
  closeDrawer,
}: ReceiptDeleteAlertProps): React.ReactElement {
  const { mutateAsync: deleteReceiptMutate, isPending: isLoading } =
    useDeleteReceipt();

  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  const handleConfirmReceiptDelete = () => {
    deleteReceiptMutate(receiptId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_receipt_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        closeDrawer(DRAWERS.RECEIPT_DETAILS);
      })
      .catch((error: Error) => {
        // Bugfix: original @ts-nocheck had an empty `.catch(() => {})` that silently swallowed failures.
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
      confirmButtonText={intl.get('delete')}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelDeleteAlert}
      onConfirm={handleConfirmReceiptDelete}
      loading={isLoading}
    >
      <p>
        {/* @ts-expect-error — react-intl-universal FormattedHTMLMessage JSX type mismatch (library-level issue, see Alerts/Items/ItemDeleteAlert.tsx) */}
        <FormattedHTMLMessage
          id={'once_delete_this_receipt_you_will_able_to_restore_it'}
        />
      </p>
    </Alert>
  );
}

export const ReceiptDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(NameDeleteAlert);
