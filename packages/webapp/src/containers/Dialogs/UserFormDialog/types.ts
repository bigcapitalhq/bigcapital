import type {
  EditUserBody,
  Role,
  RolesListResponse,
  User,
} from '@bigcapital/sdk-ts';

export interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
}

export type UserFormDialogPayload = {
  action?: string;
  userId?: number | null;
};

export type UserFormContextValue = {
  isAuth: boolean;
  userId: number | null;
  dialogName: string;
  user: User | undefined;
  // FIXME: capital `E` is inconsistent with peers; kept to avoid touching all
  // call sites.
  EditUserMutate: (vars: [number, EditUserBody]) => Promise<unknown>;
  // FIXME: `isEditMode = userId` is a number (truthy) rather than a boolean.
  // Kept as a union to reflect runtime while flagging the mismatch.
  isEditMode: number | boolean;
  roles: RolesListResponse | Role[] | undefined;
};
