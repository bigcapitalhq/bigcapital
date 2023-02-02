// @ts-nocheck
import React, { createContext, useContext } from 'react';
import {
  useEditUser,
  useUser,
  useRoles,
  useAuthenticatedAccount,
} from '@/hooks/query';

import { DialogContent } from '@/components';

const UserFormContext = createContext();

/**
 * User Form provider.
 */
function UserFormProvider({ userId, dialogName, ...props }) {
  //  edit user mutations.
  const { mutateAsync: EditUserMutate } = useEditUser();

  // fetch user detail.
  const { data: user, isLoading: isUserLoading } = useUser(userId, {
    enabled: !!userId,
  });

  // fetch roles list.
  const { data: roles, isLoading: isRolesLoading } = useRoles();

  // Retrieve authenticated user information.
  const {
    data: { id },
  } = useAuthenticatedAccount();

  const isEditMode = userId;

  const isAuth = user.system_user_id == id

  // Provider state.
  const provider = {
    isAuth,
    userId,
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
