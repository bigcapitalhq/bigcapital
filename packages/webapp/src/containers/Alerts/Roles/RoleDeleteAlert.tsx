import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedHTMLMessage } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { handleDeleteErrors } from '@/containers/Preferences/Users/Roles/utils';
import { useDeleteRole } from '@/hooks/query';
import { compose } from '@/utils';

interface RoleDeleteAlertPayload {
  roleId: number;
}

interface RoleDeleteAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: RoleDeleteAlertPayload;
}

/**
 * Role delete alert.
 */
function RoleDeleteAlertInner({
  name,
  isOpen,
  payload: { roleId },
  closeAlert,
}: RoleDeleteAlertProps): React.ReactElement {
  const { mutateAsync: deleteRole, isPending: isLoading } = useDeleteRole();

  const handleCancelDelete = () => {
    closeAlert(name);
  };

  const handleConfirmDeleteRole = () => {
    deleteRole(roleId)
      .then(() => {
        AppToaster.show({
          message: intl.get('roles.permission_schema.delete.alert_message'),
          intent: Intent.SUCCESS,
        });
      })
      .catch(
        ({ data: { errors } }: { data: { errors: { type: string }[] } }) => {
          handleDeleteErrors(errors);
        },
      )
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('delete')}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelDelete}
      onConfirm={handleConfirmDeleteRole}
      loading={isLoading}
    >
      <p>
        {/* @ts-expect-error — react-intl-universal FormattedHTMLMessage JSX type mismatch (library-level issue, see Alerts/Items/ItemDeleteAlert.tsx) */}
        <FormattedHTMLMessage
          id={
            'roles.permission_schema.once_delete_this_role_you_will_able_to_restore_it'
          }
        />
      </p>
    </Alert>
  );
}

export const RoleDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(RoleDeleteAlertInner);
