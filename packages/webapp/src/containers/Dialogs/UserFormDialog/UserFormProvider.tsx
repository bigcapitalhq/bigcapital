import React, { createContext, useContext } from 'react';
import type { UserFormContextValue } from './types';
import { DialogContent } from '@/components';
import {
  useAuthenticatedAccount,
  useEditUser,
  useRoles,
  useUser,
} from '@/hooks/query';

const UserFormContext = createContext<UserFormContextValue>(
  {} as UserFormContextValue,
);

interface UserFormProviderProps {
  userId?: number | null;
  dialogName: string;
  children?: React.ReactNode;
}

/**
 * User Form provider.
 */
function UserFormProvider({
  userId,
  dialogName,
  ...props
}: UserFormProviderProps) {
  //  edit user mutations.
  const { mutateAsync: EditUserMutate } = useEditUser();

  // fetch user detail.
  const { data: user, isLoading: isUserLoading } = useUser(userId, {
    enabled: !!userId,
  });

  // fetch roles list.
  const { data: roles, isLoading: isRolesLoading } = useRoles();

  // Retrieve authenticated user information.
  const { data: authAccountData } = useAuthenticatedAccount();

  // FIXME: `isEditMode = userId` is a number (truthy) rather than a boolean.
  const isEditMode: number | boolean = userId ?? false;

  const isAuth = user?.systemUserId === authAccountData?.id;

  // Provider state.
  const provider: UserFormContextValue = {
    isAuth,
    userId: userId ?? null,
    dialogName,

    user,
    EditUserMutate,

    isEditMode,
    roles,
  };

  return (
    <DialogContent
      isLoading={isUserLoading || isRolesLoading}
      name={'user-form'}
    >
      <UserFormContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useUserFormContext = () => useContext(UserFormContext);

export { UserFormProvider, useUserFormContext };
