import React from 'react';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import _, { isArray } from 'lodash';

import {
  useCreateRolePermissionSchema,
  useEditRolePermissionSchema,
  usePermissionsSchema,
  useRolePermission,
} from 'hooks/query';
import PreferencesPageLoader from '../../../PreferencesPageLoader';
import { transformToObject } from './utils';

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

  const { data: role, isLoading: isPermissionLoading } =
    useRolePermission(roleId, {
      enabled: !!roleId,
    });

  // Detarmines whether the new or edit mode.
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
      <div className={classNames(CLASSES.CARD)}>
        {isPermissionsSchemaLoading || isPermissionLoading ? (
          <PreferencesPageLoader />
        ) : (
          <RolesFormContext.Provider value={provider} {...props} />
        )}
      </div>
    </div>
  );
}

const useRolesFormContext = () => React.useContext(RolesFormContext);

export { RolesFormProvider, useRolesFormContext };
