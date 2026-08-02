import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { useDeleteRefundVendorCredit } from '@/hooks/query';
import { compose } from '@/utils';

interface RefundVendorCreditDeleteAlertPayload {
  vendorCreditId: number;
}

interface RefundVendorCreditDeleteAlertProps
  extends WithAlertActionsProps,
    WithDrawerActionsProps {
  name: string;
  isOpen: boolean;
  payload: RefundVendorCreditDeleteAlertPayload;
}

/**
 * Refund Vendor transactions delete alert.
 */
function RefundVendorCreditDeleteAlertInner({
  name,
  isOpen,
  payload: { vendorCreditId },
  closeAlert,
  closeDrawer,
}: RefundVendorCreditDeleteAlertProps): React.ReactElement {
  const { mutateAsync: deleteRefundVendorCreditMutate, isPending: isLoading } =
    useDeleteRefundVendorCredit();

  const handleCancelAlert = () => {
    closeAlert(name);
  };

  const handleConfirmRefundVendorCreditDelete = () => {
    deleteRefundVendorCreditMutate(vendorCreditId)
      .then(() => {
        AppToaster.show({
          message: intl.get(
            'refund_vendor_credit_transactions.alert.delete_message',
          ),
          intent: Intent.SUCCESS,
        });
        closeDrawer(DRAWERS.REFUND_VENDOR_CREDIT_DETAILS);
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
      onCancel={handleCancelAlert}
      onConfirm={handleConfirmRefundVendorCreditDelete}
      loading={isLoading}
    >
      <p>
        <T
          id={`refund_vendor_credit_transactions.once_your_delete_this_refund_vendor_credit`}
        />
      </p>
    </Alert>
  );
}

export const RefundVendorCreditDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(RefundVendorCreditDeleteAlertInner);
