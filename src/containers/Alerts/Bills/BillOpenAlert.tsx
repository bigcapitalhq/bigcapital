// @ts-nocheck
import React from 'react';
import { AppToaster, FormattedMessage as T } from '@/components';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { useOpenBill } from '@/hooks/query';
import { compose } from '@/utils';

/**
 * Bill open alert.
 */
function BillOpenAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { billId },

  // #withAlertActions
  closeAlert,
}) {
  const { isLoading, mutateAsync: openBillMutate } = useOpenBill();

  // Handle cancel open bill alert.
  const handleCancelOpenBill = () => {
    closeAlert(name);
  };

  // Handle confirm bill open.
  const handleConfirmBillOpen = () => {
    openBillMutate(billId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_bill_has_been_opened_successfully'),
          intent: Intent.SUCCESS,
        });
        closeAlert(name);
      })
      .catch((error) => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'open'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelOpenBill}
      onConfirm={handleConfirmBillOpen}
      loading={isLoading}
    >
      <p>
        <T id={'are_sure_to_open_this_bill'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(BillOpenAlert);
