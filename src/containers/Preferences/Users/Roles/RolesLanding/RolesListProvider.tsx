// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';
import { useRoles } from '@/hooks/query';

const RolesListContext = React.createContext();

/**
 * Roles list provider.
 */
function RolesListProvider({ ...props }) {
  // Fetch roles list.
  const {
    data: roles,
    isFetching: isRolesFetching,
    isLoading: isRolesLoading,
  } = useRoles();

  // Provider state.
  const provider = {
    roles,
    isRolesFetching,
    isRolesLoading,
  };
  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_USERS,
      )}
    >
      <RolesListContext.Provider value={provider} {...props} />
    </div>
  );
}

const useRolesContext = () => React.useContext(RolesListContext);

export { RolesListProvider, useRolesContext };
