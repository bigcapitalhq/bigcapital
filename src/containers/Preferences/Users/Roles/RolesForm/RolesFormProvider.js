import React from 'react';
import { flatMap, map } from 'lodash';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';

import {
  useCreateRolePermissionSchema,
  useEditRolePermissionSchema,
  usePermissionsSchema,
  useSaveSettings
} from 'hooks/query';
import PreferencesPageLoader from '../../../PreferencesPageLoader';

const RolesFormContext = React.createContext();

/**
 * Roles Form page provider.
 */
function RolesFormProvider({ ...props }) {
  // Create and edit roles mutations.
  const { mutateAsync: createRolePermissionMutate } =
    useCreateRolePermissionSchema();
  const { mutateAsync: editRolePermissionMutate } =
    useEditRolePermissionSchema();

  const {
    data: permissionsSchema,
    isLoading: isPermissionsSchemaLoading,
    isFetching: isPermissionsSchemaFetching,
  } = usePermissionsSchema();

  // Save Organization Settings.
  const { mutateAsync: saveSettingMutate } = useSaveSettings();

  // Provider state.
  const provider = {
    permissionsSchema,
    isPermissionsSchemaLoading,
    isPermissionsSchemaFetching,
    createRolePermissionMutate,
    editRolePermissionMutate,
    saveSettingMutate
  };

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_ROLES_FORM,
      )}
    >
      <div className={classNames(CLASSES.CARD)}>
        {isPermissionsSchemaLoading ? (
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
