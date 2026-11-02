/**
 * Capabilities an extension can request in its manifest.
 *
 * Capabilities are declared at install time, shown to the administrator, and
 * enforced by the host at runtime. For native extensions they are auditable;
 * for third-party extensions they are the security boundary.
 */
export const EXTENSION_CAPABILITIES = [
  'tenant.db.read',
  'tenant.db.write',
  'system.db.read',
  'events.subscribe',
  'events.intercept',
  'http.outbound',
  'jobs.register',
  'files.read',
  'files.write',
  'mail.send',
  'pdf.templates',
  'secrets.read',
  'ui.routes',
  'ui.slots',
  'ui.settings',
] as const;

export type ExtensionCapability = (typeof EXTENSION_CAPABILITIES)[number];

/**
 * Determines whether the given string is a known capability.
 */
export function isExtensionCapability(
  value: string,
): value is ExtensionCapability {
  return (EXTENSION_CAPABILITIES as readonly string[]).includes(value);
}
