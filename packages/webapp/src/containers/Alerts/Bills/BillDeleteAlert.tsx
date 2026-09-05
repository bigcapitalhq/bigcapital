import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { handleDeleteErrors } from '@/containers/Purchases/Bills/BillForm/utils';
import { useDeleteBill } from '@/hooks/query';
import { compose } from '@/utils';

interface BillDeleteAlertPayload {
  billId: number;
}

interface BillDeleteAlertProps
  extends WithAlertActionsProps,
    WithDrawerActionsProps {
  name: string;
  isOpen: boolean;
  payload: BillDeleteAlertPayload;
}

/**
 * Bill delete alert.
 */
function BillDeleteAlertInner({
  name,
  isOpen,
  payload: { billId },
  closeAlert,
  closeDrawer,
}: BillDeleteAlertProps): React.ReactElement {
  const { isPending: isLoading, mutateAsync: deleteBillMutate } =
    useDeleteBill();

  const handleCancel = () => {
    closeAlert(name);
  };

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
        ({ data: { errors } }: { data: { errors: { type: string }[] } }) => {
          handleDeleteErrors(errors);
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

export const BillDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(BillDeleteAlertInner);
