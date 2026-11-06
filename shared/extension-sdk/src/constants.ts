/**
 * Extension API version implemented by the host.
 *
 * Extensions declare a semver range in `manifest.apiVersion`. The host refuses
 * to load an extension when the range does not include this version.
 */
export const HOST_EXTENSION_API_VERSION = '1.0.0';

/**
 * Version of the manifest file format itself.
 */
export const EXTENSION_MANIFEST_VERSION = 1;

/**
 * Extension ids are lower-case, reverse-DNS or npm-style identifiers.
 *
 * Examples: `acme.reports`, `bigcapital.purchase-approvals`, `acme.tax-engine`.
 */
export const EXTENSION_ID_PATTERN = /^[a-z0-9][a-z0-9._-]*$/;

/**
 * Keys contributed by extensions (features, abilities, settings, jobs) use the
 * same safe identifier shape as extension ids.
 */
export const EXTENSION_KEY_PATTERN = /^[a-z0-9][a-z0-9._-]*$/;
