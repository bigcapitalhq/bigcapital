import { Intent, Alert } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithAlertStoreConnectProps } from '@/containers/Alert/withAlertStoreConnect';
import { AppToaster } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useActivateContact } from '@/hooks/query';
import { compose } from '@/utils';

interface CustomerActivateAlertPayload {
  customerId?: number;
  /** @deprecated legacy payload field, no longer used. Kept for backwards-compat with callers. */
  service?: unknown;
}

interface CustomerActivateAlertProps
  extends WithAlertActionsProps,
    WithAlertStoreConnectProps {
  name: string;
}

/**
 * Customer activate alert.
 */
function CustomerActivateAlertInner({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload,

  // #withAlertActions
  closeAlert,
}: CustomerActivateAlertProps) {
  const { customerId } = (payload as CustomerActivateAlertPayload) ?? {};
  const { mutateAsync: activateContact, isPending: isLoading } =
    useActivateContact();

  // Handle activate constomer alert cancel.
  const handleCancelActivateCustomer = () => {
    closeAlert(name);
  };

  // Handle confirm customer activated.
  const handleConfirmCustomerActivate = () => {
    activateContact(customerId!)
      .then(() => {
        AppToaster.show({
          message: intl.get('customer.alert.activated_message'),
          intent: Intent.SUCCESS,
        });
      })
      .catch(() => {
        // Errors are surfaced via the alert UI; nothing to do here.
      })
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('activate')}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelActivateCustomer}
      loading={isLoading}
      onConfirm={handleConfirmCustomerActivate}
    >
      <p>
        {intl.get('customer.alert.are_you_sure_want_to_activate_this_customer')}
      </p>
    </Alert>
  );
}

export const CustomerActivateAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(CustomerActivateAlertInner);
