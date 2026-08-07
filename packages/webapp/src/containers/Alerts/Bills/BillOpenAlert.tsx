import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useOpenBill } from '@/hooks/query';
import { compose } from '@/utils';

interface BillOpenAlertPayload {
  billId: number;
}

interface BillOpenAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: BillOpenAlertPayload;
}

/**
 * Bill open alert.
 */
function BillOpenAlertInner({
  name,
  isOpen,
  payload: { billId },
  closeAlert,
}: BillOpenAlertProps): React.ReactElement {
  const { isPending: isLoading, mutateAsync: openBillMutate } = useOpenBill();

  const handleCancelOpenBill = () => {
    closeAlert(name);
  };

  const handleConfirmBillOpen = () => {
    openBillMutate(billId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_bill_has_been_opened_successfully'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error: Error) => {
        // Bugfix: original @ts-nocheck silently closed the alert on error without surfacing the failure.
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
      confirmButtonText={intl.get('open')}
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

export const BillOpenAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(BillOpenAlertInner);
