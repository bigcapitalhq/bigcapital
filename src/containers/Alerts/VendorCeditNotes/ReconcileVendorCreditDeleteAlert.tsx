// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import {
  AppToaster,
  FormattedMessage as T,
  FormattedHTMLMessage,
} from '@/components';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import { useDeleteReconcileVendorCredit } from '@/hooks/query';
import { compose } from '@/utils';

/**
 * Reconcile vendor credit delete alert.
 */
function ReconcileVendorCreditDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { vendorCreditId },

  // #withAlertActions
  closeAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const { isLoading, mutateAsync: deleteReconcileVendorCreditMutate } =
    useDeleteReconcileVendorCredit();

  // handle cancel delete credit note alert.
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
        // closeDrawer('vendor-credit-detail-drawer');
      })
      .catch(
        ({
          response: {
            data: { errors },
          },
        }) => {},
      )
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'delete'} />}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelDeleteAlert}
      onConfirm={handleConfirmReconcileVendorCreditDelete}
      loading={isLoading}
    >
      <p>
        <FormattedHTMLMessage
          id={
            'reconcile_vendor_credit.alert.once_you_delete_this_reconcile_vendor_credit'
          }
        />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(ReconcileVendorCreditDeleteAlert);
