import React, { createContext } from 'react';
import type { InviteUserFormContextValue } from './types';
import { DialogContent } from '@/components';
import { useCreateInviteUser, useUsers, useRoles } from '@/hooks/query';

const InviteUserFormContext = createContext<InviteUserFormContextValue>(
  {} as InviteUserFormContextValue,
);

interface InviteUserFormProviderProps {
  userId?: unknown;
  isEditMode: string;
  dialogName: string;
  children?: React.ReactNode;
}

/**
 * Invite user Form page provider.
 */
function InviteUserFormProvider({
  userId,
  isEditMode,
  dialogName,
  ...props
}: InviteUserFormProviderProps) {
  // Create and edit item currency mutations.
  const { mutateAsync: inviteUserMutate } = useCreateInviteUser();

  // fetch users list.
  const { isLoading: isUsersLoading } = useUsers();

  // fetch roles list.
  const { data: roles, isLoading: isRolesLoading } = useRoles();

  // Provider state.
  const provider: InviteUserFormContextValue = {
    inviteUserMutate,
    dialogName,
    userId,
    isUsersLoading,
    isEditMode,
    roles,
  };

  return (
    <DialogContent
      isLoading={isUsersLoading || isRolesLoading}
      name={'invite-form'}
    >
      <InviteUserFormContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useInviteUserFormContext = () => React.useContext(InviteUserFormContext);

export { InviteUserFormProvider, useInviteUserFormContext };
