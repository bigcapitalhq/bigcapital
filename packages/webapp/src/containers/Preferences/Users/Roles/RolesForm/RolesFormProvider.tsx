// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';

import {
  useCreateRolePermissionSchema,
  useEditRolePermissionSchema,
  usePermissionsSchema,
  useRolePermission,
} from '@/hooks/query';
import PreferencesPageLoader from '@/containers/Preferences/PreferencesPageLoader';

const RolesFormContext = React.createContext();

/**
 * Roles Form page provider.
 */
function RolesFormProvider({ roleId, ...props }) {
  // Create and edit roles mutations.
  const { mutateAsync: createRolePermissionMutate } =
    useCreateRolePermissionSchema();

  const { mutateAsync: editRolePermissionMutate } =
    useEditRolePermissionSchema();

  // Retrieve permissions schema.
  const {
    data: permissionsSchema,
    isLoading: isPermissionsSchemaLoading,
    isFetching: isPermissionsSchemaFetching,
  } = usePermissionsSchema();

  const { data: role, isLoading: isPermissionLoading } = useRolePermission(
    roleId,
    {
      enabled: !!roleId,
    },
  );

  // Determines whether the new or edit mode.
  const isNewMode = !roleId;

  // Provider state.
  const provider = {
    isNewMode,
    roleId,
    role,
    permissionsSchema,
    isPermissionsSchemaLoading,
    isPermissionsSchemaFetching,
    createRolePermissionMutate,
    editRolePermissionMutate,
  };

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_ROLES_FORM,
      )}
    >
      {isPermissionsSchemaLoading || isPermissionLoading ? (
        <PreferencesPageLoader />
      ) : (
        <RolesFormContext.Provider value={provider} {...props} />
      )}
    </div>
  );
}

const useRolesFormContext = () => React.useContext(RolesFormContext);

export { RolesFormProvider, useRolesFormContext };
