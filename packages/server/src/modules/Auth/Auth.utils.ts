import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { AuthApiKeyPrefix, AuthApiKeyPrefixLength } from './Auth.constants';

export const hashPassword = (password: string): Promise<string> =>
  new Promise((resolve) => {
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(password, salt, (err, hash: string) => {
        resolve(hash);
      });
    });
  });

/**
 * Extracts and validates an API key from the Authorization header
 * @param {string} authorization - Full authorization header content.
 */
export const getAuthApiKey = (authorization: string) => {
  const apiKey = authorization.toLowerCase().replace('bearer ', '').trim();
  return apiKey.startsWith(AuthApiKeyPrefix) ? apiKey : '';
};

/**
 * Hashes the API key using SHA-256 to avoid storing the plain key in database.
 * @param {string} apiKey - The plain API key.
 * @returns {string} Hex encoded SHA-256 hash of the key.
 */
export const hashApiKey = (apiKey: string): string => {
  return createHash('sha256').update(apiKey).digest('hex');
};

/**
 * Extracts the displayable prefix of the API key.
 * @param {string} apiKey - The plain API key.
 * @returns {string} The displayable prefix of the API key.
 */
export const getApiKeyPrefix = (apiKey: string): string => {
  return apiKey.substring(0, AuthApiKeyPrefixLength);
};

/**
 * Appends query parameters to a URL. Supports both absolute URLs (e.g.
 * "https://app.example.com/auth/callback") and root-relative paths (e.g.
 * "/auth/callback"), so the same helper can be used in dev and production.
 * @param {string} baseUrl - The URL to append the query to.
 * @param {Record<string, string | number | undefined | null>} params - Query parameters.
 * @returns {string}
 */
export const buildUrlWithQuery = (
  baseUrl: string,
  params: Record<string, string | number | undefined | null>,
): string => {
  const isAbsolute = /^https?:\/\//i.test(baseUrl);
  const url = new URL(baseUrl, 'http://localhost');

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    url.searchParams.set(key, String(value));
  });

  return isAbsolute
    ? url.toString()
    : `${url.pathname}${url.search}${url.hash}`;
};
