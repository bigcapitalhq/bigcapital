// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { Intent, Alert } from '@blueprintjs/core';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import { handleDeleteErrors } from '@/containers/Purchases/Bills/BillForm/utils';
import { useDeleteBill } from '@/hooks/query';
import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

/**
 * Bill delete alert.
 */
function BillDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { billId },

  // #withAlertActions
  closeAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const { isLoading, mutateAsync: deleteBillMutate } = useDeleteBill();

  // Handle cancel Bill
  const handleCancel = () => {
    closeAlert(name);
  };

  // Handle confirm delete invoice
  const handleConfirmBillDelete = () => {
    deleteBillMutate(billId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_bill_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        closeDrawer(DRAWERS.BILL_DETAILS);
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
      icon={'trash'}
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirmBillDelete}
      loading={isLoading}
    >
      <p>
        <T id={'once_delete_this_bill_you_will_able_to_restore_it'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(BillDeleteAlert);
