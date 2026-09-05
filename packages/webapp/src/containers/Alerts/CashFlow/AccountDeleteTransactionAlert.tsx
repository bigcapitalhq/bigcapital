import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { AppToaster, FormattedHTMLMessage } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useDeleteCashflowTransaction } from '@/hooks/query';
import { compose } from '@/utils';

interface AccountDeleteTransactionAlertPayload {
  referenceId: number;
}

interface AccountDeleteTransactionAlertProps
  extends WithAlertActionsProps,
    WithDrawerActionsProps {
  name: string;
  isOpen: boolean;
  payload: AccountDeleteTransactionAlertPayload;
}

interface CashflowTransactionError {
  type: string;
}

/**
 * Account delete transaction alert.
 */
function AccountDeleteTransactionAlertInner({
  name,
  isOpen,
  payload: { referenceId },
  closeAlert,
  closeDrawer,
}: AccountDeleteTransactionAlertProps): React.ReactElement {
  const { mutateAsync: deleteTransactionMutate, isPending: isLoading } =
    useDeleteCashflowTransaction();

  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  const handleConfirmTransactioneDelete = () => {
    deleteTransactionMutate(referenceId)
      .then(() => {
        AppToaster.show({
          message: intl.get('cash_flow_transaction.delete.alert_message'),
          intent: Intent.SUCCESS,
        });
        closeDrawer(DRAWERS.CASHFLOW_TRNASACTION_DETAILS);
      })
      .catch(
        ({
          data: { errors },
        }: {
          data: { errors: CashflowTransactionError[] };
        }) => {
          if (
            errors.find(
              (e) =>
                e.type ===
                'CANNOT_DELETE_TRANSACTION_CONVERTED_FROM_UNCATEGORIZED',
            )
          ) {
            AppToaster.show({
              message:
                'Cannot delete transaction converted from uncategorized transaction but you uncategorize it.',
              intent: Intent.DANGER,
            });
          } else if (
            errors.find((e) => e.type === 'CANNOT_DELETE_TRANSACTION_MATCHED')
          ) {
            AppToaster.show({
              message:
                'Cannot delete a transaction matched to the bank transaction',
              intent: Intent.DANGER,
            });
          }
        },
      )
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
      onConfirm={handleConfirmTransactioneDelete}
      loading={isLoading}
    >
      <p>
        {/* @ts-expect-error — react-intl-universal FormattedHTMLMessage JSX type mismatch (library-level issue, see Alerts/Items/ItemDeleteAlert.tsx) */}
        <FormattedHTMLMessage
          id={
            'cash_flow_transaction_once_delete_this_transaction_you_will_able_to_restore_it'
          }
        />
      </p>
    </Alert>
  );
}

export const AccountDeleteTransactionAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(AccountDeleteTransactionAlertInner);
