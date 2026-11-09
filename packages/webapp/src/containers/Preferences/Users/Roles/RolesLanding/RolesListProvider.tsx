import classNames from 'classnames';
import React, { ReactNode } from 'react';
import type { RolesListResponse } from '@bigcapital/sdk-ts';
import { CLASSES } from '@/constants/classes';
import { useRoles } from '@/hooks/query';

interface RolesListContextValue {
  roles: RolesListResponse | undefined;
  isRolesFetching: boolean;
  isRolesLoading: boolean;
}

const RolesListContext = React.createContext<RolesListContextValue>(
  {} as RolesListContextValue,
);

interface RolesListProviderProps {
  children: ReactNode;
}

function RolesListProvider({ children, ...props }: RolesListProviderProps) {
  const {
    data: roles,
    isFetching: isRolesFetching,
    isLoading: isRolesLoading,
  } = useRoles();

  const provider: RolesListContextValue = {
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
      <RolesListContext.Provider value={provider} {...props}>
        {children}
      </RolesListContext.Provider>
    </div>
  );
}

const useRolesContext = () => React.useContext(RolesListContext);

export { RolesListProvider, useRolesContext };
