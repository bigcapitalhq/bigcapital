import React, { createContext, useContext } from 'react';
import { useEditUser, useUser } from 'hooks/query';

import { DialogContent } from 'components';

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

  const isEditMode = userId;

  // Provider state.
  const provider = {
    userId,
    dialogName,

    user,
    EditUserMutate,

    isEditMode,
  };

  return (
    <DialogContent isLoading={isUserLoading} name={'user-form'}>
      <UserFormContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useUserFormContext = () => useContext(UserFormContext);

export { UserFormProvider, useUserFormContext };
