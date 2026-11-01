import React, { createContext, ReactNode } from 'react';
import type { UsersListResponse } from '@bigcapital/sdk-ts';
import { useUsers } from '@/hooks/query';

interface UsersListContextValue {
  users: UsersListResponse | undefined;
  isUsersLoading: boolean;
  isUsersFetching: boolean;
}

const UsersListContext = createContext<UsersListContextValue>(
  {} as UsersListContextValue,
);

interface UsersListProviderProps {
  children: ReactNode;
}

function UsersListProvider({ children, ...props }: UsersListProviderProps) {
  const { data: users, isLoading, isFetching } = useUsers();

  const state: UsersListContextValue = {
    isUsersLoading: isLoading,
    isUsersFetching: isFetching,
    users,
  };

  return (
    <UsersListContext.Provider value={state} {...props}>
      {children}
    </UsersListContext.Provider>
  );
}

const useUsersListContext = () => React.useContext(UsersListContext);

export { UsersListProvider, useUsersListContext };
