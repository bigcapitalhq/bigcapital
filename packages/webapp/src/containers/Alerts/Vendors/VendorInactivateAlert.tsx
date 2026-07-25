import { Intent, Alert } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { AppToaster } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import type { WithAlertStoreConnectProps } from '@/containers/Alert/withAlertStoreConnect';
import { useInactivateContact } from '@/hooks/query';
import { compose } from '@/utils';

interface VendorInactivateAlertPayload {
  vendorId?: number;
}

interface VendorInactivateAlertProps
  extends WithAlertActionsProps,
    WithAlertStoreConnectProps {
  name: string;
}

/**
 * Vendor inactivate alert.
 */
function VendorInactivateAlertInner({
  name,
  // #withAlertStoreConnect
  isOpen,
  payload,

  // #withAlertActions
  closeAlert,
}: VendorInactivateAlertProps) {
  const { vendorId } = (payload as VendorInactivateAlertPayload) ?? {};
  const { mutateAsync: inactivateContact, isPending: isLoading } =
    useInactivateContact();

  // Handle cancel inactivate alert.
  const handleCancelInactivateVendor = () => {
    closeAlert(name);
  };

  // Handle confirm contact Inactive.
  const handleConfirmVendorInactive = () => {
    inactivateContact(vendorId!)
      .then(() => {
        AppToaster.show({
          message: intl.get('vendor.alert.inactivated_message'),
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
      onCancel={handleCancelInactivateVendor}
      onConfirm={handleConfirmVendorInactive}
      loading={isLoading}
    >
      <p>
        {intl.get('vendor.alert.are_you_sure_want_to_inactivate_this_vendor')}
      </p>
    </Alert>
  );
}

export const VendorInactivateAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(VendorInactivateAlertInner);
