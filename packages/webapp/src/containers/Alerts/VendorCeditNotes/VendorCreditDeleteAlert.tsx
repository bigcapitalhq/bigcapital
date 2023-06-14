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
import { handleDeleteErrors } from '@/containers/Purchases/CreditNotes/CreditNotesLanding/utils';
import { useDeleteVendorCredit } from '@/hooks/query';
import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

/**
 * Vendor Credit delete alert.
 */
function VendorCreditDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { vendorCreditId },

  // #withAlertActions
  closeAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const { isLoading, mutateAsync: deleteVendorCreditMutate } =
    useDeleteVendorCredit();

  // handle cancel delete credit note alert.
  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };
  const handleConfirmCreditDelete = () => {
    deleteVendorCreditMutate(vendorCreditId)
      .then(() => {
        AppToaster.show({
          message: intl.get('vendor_credits.alert.delete_message'),
          intent: Intent.SUCCESS,
        });
        closeDrawer(DRAWERS.VENDOR_CREDIT_DETAILS);
      })
      .catch(
        ({
          response: {
            data: { errors },
          },
        }) => {
          handleDeleteErrors(errors);
        },
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
      onConfirm={handleConfirmCreditDelete}
      loading={isLoading}
    >
      <p>
        <FormattedHTMLMessage
          id={'vendor_credits.note.once_delete_this_vendor_credit_note'}
        />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(VendorCreditDeleteAlert);
