import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useOpenVendorCredit } from '@/hooks/query';
import { compose } from '@/utils';

interface VendorCreditOpenedAlertPayload {
  vendorCreditId: number;
}

interface VendorCreditOpenedAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: VendorCreditOpenedAlertPayload;
}

/**
 *  Vendor credit opened alert.
 */
function VendorCreditOpenedAlertInner({
  name,
  isOpen,
  payload: { vendorCreditId },
  closeAlert,
}: VendorCreditOpenedAlertProps): React.ReactElement {
  const { mutateAsync: openVendorCreditMutate, isPending: isLoading } =
    useOpenVendorCredit();

  const handleAlertCancel = () => {
    closeAlert(name);
  };

  const handleAlertConfirm = () => {
    openVendorCreditMutate(vendorCreditId)
      .then(() => {
        AppToaster.show({
          message: intl.get('vendor_credit_opened.alert.success_message'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error: Error) => {
        // Bugfix: original @ts-nocheck had an empty `.catch((error) => {})` that silently swallowed failures.
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
      onCancel={handleAlertCancel}
      onConfirm={handleAlertConfirm}
      loading={isLoading}
    >
      <p>
        <T id={'vendor_credit_opened.are_sure_to_open_this_credit'} />
      </p>
    </Alert>
  );
}

export const VendorCreditOpenedAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(VendorCreditOpenedAlertInner);
