/**
 * An organization identity provider must still be enabled when a member
 * finishes signing in, including after a second-factor challenge.
 */
export abstract class OrganizationSigninPolicy {
  abstract resolveTenantId(organizationId: string): Promise<number>;
}
