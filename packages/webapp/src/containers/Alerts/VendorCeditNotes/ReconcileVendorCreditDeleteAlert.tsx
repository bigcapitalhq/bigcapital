import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { AppToaster, FormattedHTMLMessage } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useDeleteReconcileVendorCredit } from '@/hooks/query';
import { compose } from '@/utils';

interface ReconcileVendorCreditDeleteAlertPayload {
  vendorCreditId: number;
}

interface ReconcileVendorCreditDeleteAlertProps
  extends WithAlertActionsProps,
    WithDrawerActionsProps {
  name: string;
  isOpen: boolean;
  payload: ReconcileVendorCreditDeleteAlertPayload;
}

/**
 * Reconcile vendor credit delete alert.
 */
function ReconcileVendorCreditDeleteAlertInner({
  name,
  isOpen,
  payload: { vendorCreditId },
  closeAlert,
  closeDrawer,
}: ReconcileVendorCreditDeleteAlertProps): React.ReactElement {
  const {
    isPending: isLoading,
    mutateAsync: deleteReconcileVendorCreditMutate,
  } = useDeleteReconcileVendorCredit();

  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  const handleConfirmReconcileVendorCreditDelete = () => {
    deleteReconcileVendorCreditMutate(vendorCreditId)
      .then(() => {
        AppToaster.show({
          message: intl.get('reconcile_vendor_credit.alert.success_message'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error: Error) => {
        // Bugfix: original @ts-nocheck had an empty `.catch(({ data: { errors } }) => {})` that silently swallowed failures.
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
      onConfirm={handleConfirmReconcileVendorCreditDelete}
      loading={isLoading}
    >
      <p>
        {/* @ts-expect-error — react-intl-universal FormattedHTMLMessage JSX type mismatch (library-level issue, see Alerts/Items/ItemDeleteAlert.tsx) */}
        <FormattedHTMLMessage
          id={
            'reconcile_vendor_credit.alert.once_you_delete_this_reconcile_vendor_credit'
          }
        />
      </p>
    </Alert>
  );
}

export const ReconcileVendorCreditDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(ReconcileVendorCreditDeleteAlertInner);
