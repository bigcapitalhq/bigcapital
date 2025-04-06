import { ServiceError } from '../Items/ServiceError';
import { ERRORS } from './constants';
import { Role } from './models/Role.model';

/**
 * Valdiates role is not predefined.
 * @param {IRole} role - Role object.
 */
export const validateRoleNotPredefined = (role: Role) => {
  if (role.predefined) {
    throw new ServiceError(ERRORS.ROLE_PREFINED);
  }
};
