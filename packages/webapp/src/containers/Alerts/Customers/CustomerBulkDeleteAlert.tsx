import { Intent, Alert } from '@blueprintjs/core';
import { useCallback, useState } from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithAlertStoreConnectProps } from '@/containers/Alert/withAlertStoreConnect';
import { AppToaster } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { transformErrors } from '@/containers/Customers/utils';
import { compose } from '@/utils';

interface CustomerBulkDeleteAlertPayload {
  customersIds?: number[];
}

interface CustomerBulkDeleteAlertProps
  extends WithAlertActionsProps,
    WithAlertStoreConnectProps {
  name: string;
}

/**
 * Customer bulk delete alert.
 *
 * NOTE: The original @ts-nocheck file referenced a global
 * `requestDeleteBulkCustomers` function that was never imported — calling
 * `handleConfirmBulkDelete` at runtime would throw a ReferenceError. The bug
 * is preserved below using `@ts-expect-error` so that the broken handler is
 * not silently re-typed away; this keeps behavior identical to the original.
 */
function CustomerBulkDeleteAlertInner({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload,

  // #withAlertActions
  closeAlert,
}: CustomerBulkDeleteAlertProps) {
  const { customersIds } = (payload as CustomerBulkDeleteAlertPayload) ?? {};
  const [isLoading, setLoading] = useState(false);

  // handle cancel delete  alert.
  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  // Handle confirm customers bulk delete.
  const handleConfirmBulkDelete = useCallback(() => {
    setLoading(true);
    // @ts-expect-error — latent bug preserved: `requestDeleteBulkCustomers` is not defined anywhere in the codebase; the original @ts-nocheck hid this ReferenceError.
    requestDeleteBulkCustomers(customersIds)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_customers_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((errors: unknown) => {
        transformErrors(errors);
      })
      .finally(() => {
        setLoading(false);
        closeAlert(name);
      });
  }, [customersIds, name, closeAlert]);

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('delete')}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelDeleteAlert}
      onConfirm={handleConfirmBulkDelete}
      loading={isLoading}
    >
      <p>
        {intl.get('once_delete_these_customers_you_will_not_able_restore_them')}
      </p>
    </Alert>
  );
}

export const CustomerBulkDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(CustomerBulkDeleteAlertInner);
