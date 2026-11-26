import { SetMetadata } from '@nestjs/common';

/** Overrides the default organization-scoped session policy for an endpoint.
 * Tenant-scoped routes are available by default. Account-wide routes must opt in.
 */
export const ORGANIZATION_SESSION_ALLOWED = 'organizationSessionAllowed';
export const AllowOrganizationSession = (allow = true) =>
  SetMetadata(ORGANIZATION_SESSION_ALLOWED, allow);
