import classNames from 'classnames';
import React from 'react';
import { CLASSES } from '@/constants/classes';
import { PreferencesPageLoader } from '@/containers/Preferences/PreferencesPageLoader';
import {
  useCreateRolePermissionSchema,
  useEditRolePermissionSchema,
  usePermissionsSchema,
  useRolePermission,
} from '@/hooks/query';

type CreateRolePermissionMutate = ReturnType<
  typeof useCreateRolePermissionSchema
>['mutateAsync'];
type EditRolePermissionMutate = ReturnType<
  typeof useEditRolePermissionSchema
>['mutateAsync'];

export interface RolesFormContextValue {
  isNewMode: boolean;
  roleId: number;
  role: ReturnType<typeof useRolePermission>['data'];
  permissionsSchema: ReturnType<typeof usePermissionsSchema>['data'];
  isPermissionsSchemaLoading: boolean;
  isPermissionsSchemaFetching: boolean;
  createRolePermissionMutate: CreateRolePermissionMutate;
  editRolePermissionMutate: EditRolePermissionMutate;
}

const RolesFormContext = React.createContext<RolesFormContextValue>(
  {} as RolesFormContextValue,
);

export interface RolesFormProviderProps {
  roleId?: number;
  children?: React.ReactNode;
}

/**
 * Roles Form page provider.
 */
function RolesFormProvider({ roleId, children }: RolesFormProviderProps) {
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

  // Detarmines whether the new or edit mode.
  const isNewMode = !roleId;

  // Provider state.
  const provider: RolesFormContextValue = {
    isNewMode,
    roleId: roleId ?? 0,
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
        <RolesFormContext.Provider value={provider}>
          {children}
        </RolesFormContext.Provider>
      )}
    </div>
  );
}

const useRolesFormContext = () => React.useContext(RolesFormContext);

export { RolesFormProvider, useRolesFormContext };
