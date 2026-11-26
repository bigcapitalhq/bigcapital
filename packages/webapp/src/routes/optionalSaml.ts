import type { ComponentType } from 'react';

export interface SamlIntegration {
  authenticationRoutes: Array<{ path: string; component: ComponentType }>;
  LoginLink: ComponentType;
  OrganizationPreferences: ComponentType;
}

// A build without the enterprise SAML package has no matching registration.
const registrations = import.meta.glob<SamlIntegration>(
  '../ee/saml/index.tsx',
  { eager: true, import: 'default' },
);
export const saml: SamlIntegration | undefined =
  Object.values(registrations)[0];
