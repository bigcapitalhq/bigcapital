// @ts-nocheck
import intl from 'react-intl-universal';
import { Intent } from '@blueprintjs/core';
import { AppToaster } from '@/components';

// handle delete errors.
export const handleDeleteErrors = (errors) => {
  if (errors.find((error) => error.type === 'ROLE_PREDEFINED')) {
    AppToaster.show({
      message: intl.get('roles.error.role_is_predefined'),
      intent: Intent.DANGER,
    });
  }
  if (errors.find((error) => error.type === 'INVALIDATE_PERMISSIONS')) {
    AppToaster.show({
      message: intl.get('roles.error.the_submit_role_has_invalid_permissions'),
      intent: Intent.DANGER,
    });
  }
  if (
    errors.find(
      (error) => error.type === 'CANNOT_DELETE_ROLE_ASSOCIATED_TO_USERS',
    )
  ) {
    AppToaster.show({
      message: intl.get(
        'roles.error.you_cannot_delete_role_that_associated_to_users',
      ),
      intent: Intent.DANGER,
    });
  }
};
