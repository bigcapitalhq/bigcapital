import { Intent, Alert } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { AppToaster } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import type { WithAlertStoreConnectProps } from '@/containers/Alert/withAlertStoreConnect';
import { useInactivateContact } from '@/hooks/query';
import { compose } from '@/utils';

interface CustomerInactivateAlertPayload {
  customerId?: number;
  /** @deprecated legacy payload field, no longer used. Kept for backwards-compat with callers. */
  service?: unknown;
}

interface CustomerInactivateAlertProps
  extends WithAlertActionsProps,
    WithAlertStoreConnectProps {
  name: string;
}

/**
 * customer inactivate alert.
 */
function CustomerInactivateAlertInner({
  name,
  // #withAlertStoreConnect
  isOpen,
  payload,

  // #withAlertActions
  closeAlert,
}: CustomerInactivateAlertProps) {
  const { customerId } = (payload as CustomerInactivateAlertPayload) ?? {};
  const { mutateAsync: inactivateContact, isPending: isLoading } =
    useInactivateContact();

  // Handle cancel inactivate alert.
  const handleCancelInactivateCustomer = () => {
    closeAlert(name);
  };

  // Handle confirm contact Inactive.
  const handleConfirmCustomerInactive = () => {
    inactivateContact(customerId!)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_contact_has_been_inactivated_successfully'),
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
      confirmButtonText={intl.get('inactivate')}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelInactivateCustomer}
      onConfirm={handleConfirmCustomerInactive}
      loading={isLoading}
    >
      <p>
        {intl.get(
          'customer.alert.are_you_sure_want_to_inactivate_this_customer',
        )}
      </p>
    </Alert>
  );
}
export const CustomerInactivateAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(CustomerInactivateAlertInner);
