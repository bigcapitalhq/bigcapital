import { USERS_ERROR_TYPES } from '@bigcapital/sdk-ts';
import intl from 'react-intl-universal';

interface ResponseError {
  type: string;
}

export const transformApiErrors = (errors: ResponseError[]) => {
  const fields: Record<string, string> = {};
  const hasError = (type: string) =>
    errors.some((error) => error.type === type);

  if (
    hasError(USERS_ERROR_TYPES.EmailAlreadyInvited) ||
    hasError(USERS_ERROR_TYPES.EmailExists)
  ) {
    fields.email = intl.get('email_is_already_used');
  }
  if (hasError(USERS_ERROR_TYPES.CannotGrantRole)) {
    fields.roleId = intl.get('roles.error.you_cannot_grant_this_role');
  }
  if (hasError(USERS_ERROR_TYPES.RoleNotFound)) {
    fields.roleId = intl.get('roles.error.role_not_found');
  }
  return fields;
};
