import { Intent, Alert } from '@blueprintjs/core';
import { useCallback } from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithAlertStoreConnectProps } from '@/containers/Alert/withAlertStoreConnect';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { AppToaster } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { transformErrors } from '@/containers/Customers/utils';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useDeleteCustomer } from '@/hooks/query';
import { compose } from '@/utils';

interface CustomerDeleteAlertPayload {
  contactId?: number;
}

interface CustomerDeleteAlertProps
  extends WithAlertActionsProps,
    WithAlertStoreConnectProps,
    WithDrawerActionsProps {
  name: string;
}

/**
 * Customer delete alert.
 */
function CustomerDeleteAlertInner({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload,

  // #withAlertActions
  closeAlert,

  // #withDrawerActions
  closeDrawer,
}: CustomerDeleteAlertProps) {
  const { contactId } = (payload as CustomerDeleteAlertPayload) ?? {};
  const { mutateAsync: deleteCustomerMutate, isPending: isLoading } =
    useDeleteCustomer();

  // handle cancel delete  alert.
  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  // handle confirm delete customer.
  const handleConfirmDeleteCustomer = useCallback(() => {
    deleteCustomerMutate(contactId!)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_customer_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        closeDrawer(DRAWERS.CUSTOMER_DETAILS);
      })
      .catch((error: { data?: { errors?: unknown } }) => {
        const errors = error?.data?.errors;
        transformErrors(errors);
      })
      .finally(() => {
        closeAlert(name);
      });
  }, [deleteCustomerMutate, contactId, closeAlert, name, closeDrawer]);

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('delete')}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelDeleteAlert}
      onConfirm={handleConfirmDeleteCustomer}
      loading={isLoading}
    >
      <p data-testId={'customer-delete-alert'}>
        {/* `intl.formatHTMLMessage` returns a React fragment containing the
            translated HTML markup. The shape is not a JSX component so we
            inline the call here. */}
        {intl.formatHTMLMessage({
          id: 'once_delete_this_customer_you_will_able_to_restore_it',
        })}
      </p>
    </Alert>
  );
}

export const CustomerDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(CustomerDeleteAlertInner);
