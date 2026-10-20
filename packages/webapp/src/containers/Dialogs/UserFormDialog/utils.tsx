import { USERS_ERROR_TYPES } from '@bigcapital/sdk-ts';
import intl from 'react-intl-universal';

export const UserFormCalloutCode = {
  OwnRole: 200,
  GrantRole: 201,
  LastAdmin: 202,
} as const;

interface ResponseError {
  type: string;
}

interface TransformErrorsArgs {
  setErrors: (errors: Partial<Record<string, string>>) => void;
  setCalloutCode: (codes: number[]) => void;
}

// handle user form errors.
export const transformErrors = (
  errors: ResponseError[],
  { setErrors, setCalloutCode }: TransformErrorsArgs,
) => {
  const fields: Partial<Record<string, string>> = {};
  const calloutCodes: number[] = [];
  const hasError = (type: string) =>
    errors.some((error) => error.type === type);

  if (hasError(USERS_ERROR_TYPES.CannotAuthorizedUserMutateRole)) {
    calloutCodes.push(UserFormCalloutCode.OwnRole);
    fields.roleId = intl.get('roles.error.you_cannot_change_your_own_role');
  }
  if (hasError(USERS_ERROR_TYPES.CannotGrantRole)) {
    calloutCodes.push(UserFormCalloutCode.GrantRole);
    fields.roleId = intl.get('roles.error.you_cannot_grant_this_role');
  }
  if (hasError(USERS_ERROR_TYPES.CannotRemoveLastAdmin)) {
    calloutCodes.push(UserFormCalloutCode.LastAdmin);
  }
  if (hasError(USERS_ERROR_TYPES.RoleNotFound)) {
    fields.roleId = intl.get('roles.error.role_not_found');
  }
  if (hasError(USERS_ERROR_TYPES.EmailAlreadyExists)) {
    fields.email = intl.get('email_is_already_used');
  }
  if (calloutCodes.length > 0) {
    setCalloutCode(calloutCodes);
  }
  if (Object.keys(fields).length > 0) {
    setErrors(fields);
  }
};
