import React from 'react';
import {
  FormattedMessage as T,
  useIntl,
} from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster } from 'components';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';

import { useDeleteBill } from 'hooks/query';

import { compose } from 'utils';

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
}) {
  const { formatMessage } = useIntl();
  const { isLoading, mutateAsync: deleteBillMutate } = useDeleteBill();

  // handle cancel Bill
  const handleCancel = () => {
    closeAlert(name);
  };

  // handleConfirm delete invoice
  const handleConfirmBillDelete = () => {
    deleteBillMutate(billId).then(() => {
      AppToaster.show({
        message: formatMessage({
          id: 'the_bill_has_been_deleted_successfully',
        }),
        intent: Intent.SUCCESS,
      });
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
)(BillDeleteAlert);
