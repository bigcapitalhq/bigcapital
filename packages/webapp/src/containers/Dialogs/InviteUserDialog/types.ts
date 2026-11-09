import type { useCreateInviteUser } from '@/hooks/query';
import type { Role } from '@bigcapital/sdk-ts';

export interface InviteUserFormValues {
  email: string;
  roleId: number | string;
  status?: number;
  [key: string]: unknown;
}

export type InviteUserDialogPayload = {
  action: string;
  id: number | null;
};

export type InviteUserFormContextValue = {
  inviteUserMutate: ReturnType<typeof useCreateInviteUser>['mutateAsync'];
  dialogName: string;
  userId?: unknown;
  isUsersLoading: boolean;
  isEditMode: string;
  roles: Role[] | undefined;
};
