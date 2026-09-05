import { Intent, Alert } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithAlertStoreConnectProps } from '@/containers/Alert/withAlertStoreConnect';
import { AppToaster } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useActivateContact } from '@/hooks/query';
import { compose } from '@/utils';

interface VendorActivateAlertPayload {
  vendorId?: number;
}

interface VendorActivateAlertProps
  extends WithAlertActionsProps,
    WithAlertStoreConnectProps {
  name: string;
}

/**
 * Vendor activate alert.
 */
function VendorActivateAlertInner({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload,

  // #withAlertActions
  closeAlert,
}: VendorActivateAlertProps) {
  const { vendorId } = (payload as VendorActivateAlertPayload) ?? {};
  const { mutateAsync: activateContact, isPending: isLoading } =
    useActivateContact();

  // Handle activate vendor alert cancel.
  const handleCancelActivateVendor = () => {
    closeAlert(name);
  };

  // Handle confirm vendor activated.
  const handleConfirmVendorActivate = () => {
    activateContact(vendorId!)
      .then(() => {
        AppToaster.show({
          message: intl.get('vendor.alert.activated_message'),
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
      onCancel={handleCancelActivateVendor}
      loading={isLoading}
      onConfirm={handleConfirmVendorActivate}
    >
      <p>
        {intl.get('vendor.alert.are_you_sure_want_to_activate_this_vendor')}
      </p>
    </Alert>
  );
}

export const VendorActivateAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(VendorActivateAlertInner);
