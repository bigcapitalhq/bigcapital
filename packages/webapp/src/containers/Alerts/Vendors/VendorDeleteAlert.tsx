import { Intent, Alert } from '@blueprintjs/core';
import { useCallback } from 'react';
import intl from 'react-intl-universal';
import { AppToaster } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import type { WithAlertStoreConnectProps } from '@/containers/Alert/withAlertStoreConnect';
import { transformErrors } from '@/containers/Vendors/utils';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { useDeleteVendor } from '@/hooks/query';
import { compose } from '@/utils';

interface VendorDeleteAlertPayload {
  contactId?: number;
}

interface VendorDeleteAlertProps
  extends WithAlertActionsProps,
    WithAlertStoreConnectProps,
    WithDrawerActionsProps {
  name: string;
}

/**
 * Vendor delete alert.
 */
function VendorDeleteAlertInner({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload,

  // #withAlertActions
  closeAlert,

  // #withDrawerActions
  closeDrawer,
}: VendorDeleteAlertProps) {
  const { contactId } = (payload as VendorDeleteAlertPayload) ?? {};
  const { mutateAsync: deleteVendorMutate, isPending: isLoading } =
    useDeleteVendor();

  // Handle cancel delete the vendor.
  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  // Handle confirm delete vendor.
  const handleConfirmDeleteVendor = useCallback(() => {
    deleteVendorMutate(contactId!)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_vendor_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        closeDrawer(DRAWERS.VENDOR_DETAILS);
      })
      .catch((error: { data?: { errors?: unknown } }) => {
        const errors = error?.data?.errors;
        transformErrors(errors);
      })
      .finally(() => {
        closeAlert(name);
      });
  }, [deleteVendorMutate, name, closeAlert, contactId, closeDrawer]);

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('delete')}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelDeleteAlert}
      onConfirm={handleConfirmDeleteVendor}
      loading={isLoading}
    >
      <p data-testId={'vendor-delete-alert'}>
        {/* `intl.formatHTMLMessage` returns a React fragment containing the
            translated HTML markup. The shape is not a JSX component so we
            inline the call here. */}
        {intl.formatHTMLMessage({
          id: 'once_delete_this_vendor_you_will_able_to_restore_it',
        })}
      </p>
    </Alert>
  );
}

export const VendorDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(VendorDeleteAlertInner);
